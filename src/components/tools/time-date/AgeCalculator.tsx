'use client';

import { useState, useEffect } from 'react';
import { differenceInYears, differenceInMonths, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
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
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (birthDate) {
      const calculateAge = () => {
        const now = new Date();
        const years = differenceInYears(now, birthDate);
        const months = differenceInMonths(now, birthDate) % 12;
        const days = differenceInDays(now, birthDate) % 30;
        const hours = differenceInHours(now, birthDate) % 24;
        const minutes = differenceInMinutes(now, birthDate) % 60;
        const seconds = differenceInSeconds(now, birthDate) % 60;

        setAge({ years, months, days, hours, minutes, seconds });
      };

      // Calculate immediately
      calculateAge();

      // Update every second
      const interval = setInterval(calculateAge, 1000);
      return () => clearInterval(interval);
    }
  }, [birthDate]);

  const formatDateTime = (date: Date | null) => {
    if (!date) return 'Select Birth Date & Time';
    return date.toLocaleString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="flex flex-col w-full h-full m-0">
      {/* Date and Time Display Row */}
      <div className="flex w-full flex-1 border-b border-gray-800">
        <div className="relative w-full h-full flex items-center justify-center">
          <motion.div 
            className="w-full h-full flex items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            onClick={() => setShowModal(true)}
          >
            <div className="text-white text-2xl md:text-5xl font-bold">
              {formatDateTime(birthDate)}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Age Display Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 w-full flex-1">
        <div className="relative h-full flex flex-col items-center justify-center border-r border-b border-gray-800">
          <motion.div 
            className="w-full h-full flex flex-col items-center justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="text-gray-400 text-base md:text-xl lg:text-2xl">Years</div>
            <div className="text-white text-3xl md:text-5xl lg:text-6xl font-bold">{age.years}</div>
          </motion.div>
        </div>
        <div className="relative h-full flex flex-col items-center justify-center border-r border-b border-gray-800">
          <motion.div 
            className="w-full h-full flex flex-col items-center justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="text-gray-400 text-base md:text-xl lg:text-2xl">Months</div>
            <div className="text-white text-3xl md:text-5xl lg:text-6xl font-bold">{age.months}</div>
          </motion.div>
        </div>
        <div className="relative h-full flex flex-col items-center justify-center border-r md:border-r-0 border-b border-gray-800">
          <motion.div 
            className="w-full h-full flex flex-col items-center justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="text-gray-400 text-base md:text-xl lg:text-2xl">Days</div>
            <div className="text-white text-3xl md:text-5xl lg:text-6xl font-bold">{age.days}</div>
          </motion.div>
        </div>
        <div className="relative h-full flex flex-col items-center justify-center border-r border-b border-gray-800">
          <motion.div 
            className="w-full h-full flex flex-col items-center justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="text-gray-400 text-base md:text-xl lg:text-2xl">Hours</div>
            <div className="text-white text-3xl md:text-5xl lg:text-6xl font-bold">{age.hours}</div>
          </motion.div>
        </div>
        <div className="relative h-full flex flex-col items-center justify-center border-r border-b border-gray-800">
          <motion.div 
            className="w-full h-full flex flex-col items-center justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="text-gray-400 text-base md:text-xl lg:text-2xl">Minutes</div>
            <div className="text-white text-3xl md:text-5xl lg:text-6xl font-bold">{age.minutes}</div>
          </motion.div>
        </div>
        <div className="relative h-full flex flex-col items-center justify-center border-b border-gray-800">
          <motion.div 
            className="w-full h-full flex flex-col items-center justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="text-gray-400 text-base md:text-xl lg:text-2xl">Seconds</div>
            <div className="text-white text-3xl md:text-5xl lg:text-6xl font-bold">{age.seconds}</div>
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
                  <StaticDateTimePicker
                    value={birthDate}
                    onChange={(newValue) => {
                      if (newValue) {
                        setBirthDate(newValue);
                      }
                    }}
                    onAccept={(newValue) => {
                      if (newValue) {
                        setBirthDate(newValue);
                        setShowModal(false);
                      }
                    }}
                    maxDateTime={new Date()}
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