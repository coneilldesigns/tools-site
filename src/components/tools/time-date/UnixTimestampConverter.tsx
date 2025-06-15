'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
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

export default function UnixTimestampConverter() {
  const [timestamp, setTimestamp] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());
  const [showModal, setShowModal] = useState(false);
  const [timestampError, setTimestampError] = useState<string>('');

  useEffect(() => {
    if (timestamp) {
      try {
        const date = new Date(parseInt(timestamp) * 1000);
        if (isNaN(date.getTime())) {
          setTimestampError('Invalid timestamp');
        } else {
          setTimestampError('');
          setDate(date);
        }
      } catch {
        setTimestampError('Invalid timestamp');
      }
    }
  }, [timestamp]);

  const handleDateChange = (newDate: Date | null) => {
    if (newDate) {
      setDate(newDate);
      setTimestamp(Math.floor(newDate.getTime() / 1000).toString());
      setTimestampError('');
    }
  };

  return (
    <div className="flex flex-col w-full h-full m-0">
      {/* Timestamp Input Row */}
      <div className="flex w-full flex-1 border-b border-gray-800">
        <div className="relative w-full h-full flex items-center justify-center">
          <motion.div 
            className="w-full h-full flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="relative w-full max-w-md">
              <input
                type="text"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                placeholder="Enter Unix timestamp"
                className="w-full text-center bg-transparent border-none focus:ring-0 focus:outline-none text-white text-2xl md:text-4xl font-bold placeholder-gray-600"
              />
              {timestampError && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-red-500 text-sm">
                  {timestampError}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Date Display Row */}
      <div className="flex w-full flex-1">
        <div className="relative w-full h-full flex items-center justify-center">
          <motion.div 
            className="w-full h-full flex items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            onClick={() => setShowModal(true)}
          >
            <div className="text-white text-2xl md:text-5xl font-bold">
              {format(date, 'yyyy-MM-dd HH:mm:ss')}
            </div>
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
                    value={date}
                    onChange={(newValue) => {
                      if (newValue) {
                        handleDateChange(newValue);
                        setShowModal(false);
                      }
                    }}
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