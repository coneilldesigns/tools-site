'use client';

import { useState, useEffect } from 'react';
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

export default function CountdownTimer() {
  const [targetDateTime, setTargetDateTime] = useState<Date>(() => {
    const now = new Date();
    now.setDate(now.getDate() + 10);
    return now;
  });
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (targetDateTime) {
      const interval = setInterval(() => {
        const now = new Date();
        const difference = targetDateTime.getTime() - now.getTime();
        
        if (difference <= 0) {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          clearInterval(interval);
          return;
        }

        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [targetDateTime]);

  const formatDateTime = (date: Date | null) => {
    if (!date) return 'Select Date & Time';
    return date.toLocaleString('en-US', {
      weekday: 'long',
      month: 'short',
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
              {formatDateTime(targetDateTime)}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Time Display Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 w-full flex-1">
        <div className="relative h-full flex flex-col items-center justify-center border-r border-b md:border-b-0 border-gray-800">
          <motion.div 
            className="w-full h-full flex flex-col items-center justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="text-gray-400 text-base md:text-xl lg:text-2xl">Days</div>
            <div className="text-white text-3xl md:text-5xl lg:text-6xl font-bold">{timeLeft.days}</div>
          </motion.div>
        </div>
        <div className="relative h-full flex flex-col items-center justify-center border-r border-b md:border-b-0 border-gray-800">
          <motion.div 
            className="w-full h-full flex flex-col items-center justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="text-gray-400 text-base md:text-xl lg:text-2xl">Hours</div>
            <div className="text-white text-3xl md:text-5xl lg:text-6xl font-bold">{timeLeft.hours}</div>
          </motion.div>
        </div>
        <div className="relative h-full flex flex-col items-center justify-center border-r border-gray-800">
          <motion.div 
            className="w-full h-full flex flex-col items-center justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="text-gray-400 text-base md:text-xl lg:text-2xl">Minutes</div>
            <div className="text-white text-3xl md:text-5xl lg:text-6xl font-bold">{timeLeft.minutes}</div>
          </motion.div>
        </div>
        <div className="relative h-full flex flex-col items-center justify-center">
          <motion.div 
            className="w-full h-full flex flex-col items-center justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="text-gray-400 text-base md:text-xl lg:text-2xl">Seconds</div>
            <div className="text-white text-3xl md:text-5xl lg:text-6xl font-bold">{timeLeft.seconds}</div>
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
                    value={targetDateTime}
                    onChange={(newValue) => {
                      if (newValue) {
                        const newDate = new Date(newValue);
                        newDate.setHours(0, 0, 0, 0);
                        setTargetDateTime(newDate);
                        setShowModal(false);
                      }
                    }}
                    minDate={new Date()}
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