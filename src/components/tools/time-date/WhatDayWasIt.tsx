'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

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

export default function WhatDayWasIt() {
  const [date, setDate] = useState<Date>(new Date());
  const [showModal, setShowModal] = useState(false);
  const [dayInfo, setDayInfo] = useState<{
    dayOfWeek: string;
    fullDate: string;
  }>({
    dayOfWeek: format(new Date(), 'EEEE'),
    fullDate: format(new Date(), 'MMMM d, yyyy')
  });

  useEffect(() => {
    setDayInfo({
      dayOfWeek: format(date, 'EEEE'),
      fullDate: format(date, 'MMMM d, yyyy')
    });
  }, [date]);

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
              {dayInfo.fullDate}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Day Info Display */}
      <div className="flex w-full flex-1">
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          <motion.div 
            className="w-full h-full flex flex-col items-center justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="text-gray-400 text-base md:text-xl lg:text-2xl">Day of Week</div>
            <div className="text-white text-3xl md:text-5xl lg:text-6xl font-bold">{dayInfo.dayOfWeek}</div>
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
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 p-6 rounded-lg shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    value={date}
                    onChange={(newValue) => {
                      setDate(newValue ?? date);
                      setShowModal(false);
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: "outlined",
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.23)',
                            },
                            '&:hover fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.5)',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#10B981',
                            },
                          },
                        },
                      },
                    }}
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