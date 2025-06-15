'use client';

import { useState, useEffect } from 'react';
import { differenceInYears, differenceInMonths, differenceInDays } from 'date-fns';
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

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [age, setAge] = useState({
    years: 0,
    months: 0,
    days: 0
  });

  useEffect(() => {
    if (birthDate) {
      const today = new Date();
      const years = differenceInYears(today, birthDate);
      const months = differenceInMonths(today, birthDate) % 12;
      const days = differenceInDays(today, birthDate) % 30;

      setAge({ years, months, days });
    }
  }, [birthDate]);

  const formatDate = (date: Date | null) => {
    if (!date) return 'Select Birth Date';
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
        <div className="relative w-full h-full flex items-center justify-center">
          <motion.div 
            className="w-full h-full flex items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            onClick={() => setShowModal(true)}
          >
            <div className="text-white text-2xl md:text-5xl font-bold">
              {formatDate(birthDate)}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Age Display Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 w-full flex-1">
        <div className="relative h-full flex flex-col items-center justify-center border-r border-b md:border-b-0 border-gray-800">
          <motion.div 
            className="w-full h-full flex flex-col items-center justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="text-gray-400 text-base md:text-xl lg:text-2xl">Years</div>
            <div className="text-white text-3xl md:text-5xl lg:text-6xl font-bold">{age.years}</div>
          </motion.div>
        </div>
        <div className="relative h-full flex flex-col items-center justify-center border-r border-b md:border-b-0 border-gray-800">
          <motion.div 
            className="w-full h-full flex flex-col items-center justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="text-gray-400 text-base md:text-xl lg:text-2xl">Months</div>
            <div className="text-white text-3xl md:text-5xl lg:text-6xl font-bold">{age.months}</div>
          </motion.div>
        </div>
        <div className="relative h-full flex flex-col items-center justify-center col-span-2 md:col-span-1">
          <motion.div 
            className="w-full h-full flex flex-col items-center justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="text-gray-400 text-base md:text-xl lg:text-2xl">Days</div>
            <div className="text-white text-3xl md:text-5xl lg:text-6xl font-bold">{age.days}</div>
          </motion.div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowModal(false)}
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
                    value={birthDate}
                    onChange={(newValue) => {
                      if (newValue) {
                        setBirthDate(newValue);
                        setShowModal(false);
                      }
                    }}
                    maxDate={new Date()}
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