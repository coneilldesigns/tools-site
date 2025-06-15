'use client';

import { useState, useEffect } from 'react';
import { differenceInDays, differenceInMonths, differenceInYears } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { calendarStyles } from './sharedStyles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#10B981', // emerald-500
    },
    background: {
      default: '#111827', // gray-900
      paper: '#1F2937', // gray-800
    },
  },
});

export default function DaysBetweenDates() {
  const [startDate, setStartDate] = useState<Date>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 15); // 15 days ago
    return date;
  });
  const [endDate, setEndDate] = useState<Date>(() => {
    const date = new Date();
    date.setDate(date.getDate() + 15); // 15 days from now
    return date;
  });
  const [showStartModal, setShowStartModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [difference, setDifference] = useState({
    years: 0,
    months: 0,
    days: 0
  });

  useEffect(() => {
    if (startDate && endDate) {
      const years = differenceInYears(endDate, startDate);
      const months = differenceInMonths(endDate, startDate) % 12;
      const days = differenceInDays(endDate, startDate) % 30;

      setDifference({ years, months, days });
    }
  }, [startDate, endDate]);

  const formatDate = (date: Date | null) => {
    if (!date) return 'Select Date';
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="flex flex-col w-full h-full m-0">
      {/* Date Display Row */}
      <div className="flex w-full flex-1 border-b border-gray-800">
        <div className="relative w-1/2 h-full flex items-center justify-center border-r border-gray-800">
          <motion.div 
            className="w-full h-full flex items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            onClick={() => setShowStartModal(true)}
          >
            <div className="text-white text-xl md:text-3xl font-bold">
              {formatDate(startDate)}
            </div>
          </motion.div>
        </div>
        <div className="relative w-1/2 h-full flex items-center justify-center">
          <motion.div 
            className="w-full h-full flex items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            onClick={() => setShowEndModal(true)}
          >
            <div className="text-white text-xl md:text-3xl font-bold">
              {formatDate(endDate)}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Difference Display Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 w-full flex-1">
        <div className="relative h-full flex flex-col items-center justify-center border-r border-b md:border-b-0 border-gray-800">
          <motion.div 
            className="w-full h-full flex flex-col items-center justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="text-gray-400 text-base md:text-xl lg:text-2xl">Years</div>
            <div className="text-white text-3xl md:text-5xl lg:text-6xl font-bold">{difference.years}</div>
          </motion.div>
        </div>
        <div className="relative h-full flex flex-col items-center justify-center border-r border-b md:border-b-0 border-gray-800">
          <motion.div 
            className="w-full h-full flex flex-col items-center justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="text-gray-400 text-base md:text-xl lg:text-2xl">Months</div>
            <div className="text-white text-3xl md:text-5xl lg:text-6xl font-bold">{difference.months}</div>
          </motion.div>
        </div>
        <div className="relative h-full flex flex-col items-center justify-center col-span-2 md:col-span-1">
          <motion.div 
            className="w-full h-full flex flex-col items-center justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="text-gray-400 text-base md:text-xl lg:text-2xl">Days</div>
            <div className="text-white text-3xl md:text-5xl lg:text-6xl font-bold">{difference.days}</div>
          </motion.div>
        </div>
      </div>

      {/* Start Date Modal */}
      <AnimatePresence>
        {showStartModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowStartModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full h-full bg-gray-900 flex items-center justify-center"
              onClick={e => e.stopPropagation()}
            >
              <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <StaticDatePicker
                    value={startDate}
                    onChange={(newValue) => {
                      if (newValue) {
                        setStartDate(newValue);
                        setShowStartModal(false);
                      }
                    }}
                    maxDate={endDate}
                    sx={calendarStyles}
                  />
                </LocalizationProvider>
              </ThemeProvider>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* End Date Modal */}
      <AnimatePresence>
        {showEndModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowEndModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full h-full bg-gray-900 flex items-center justify-center"
              onClick={e => e.stopPropagation()}
            >
              <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <StaticDatePicker
                    value={endDate}
                    onChange={(newValue) => {
                      if (newValue) {
                        setEndDate(newValue);
                        setShowEndModal(false);
                      }
                    }}
                    minDate={startDate}
                    sx={calendarStyles}
                  />
                </LocalizationProvider>
              </ThemeProvider>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 