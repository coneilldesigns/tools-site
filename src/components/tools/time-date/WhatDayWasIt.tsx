'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
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

interface HistoricalEvent {
  description: string;
  year: number;
}

interface Holiday {
  date: string;
  name: string;
}

interface DayInfo {
  dayOfWeek: string;
  fullDate: string;
  historicalEvents: string[];
  holidays: string[];
  moonPhase: string;
  sunrise: string;
  sunset: string;
}

const initialDayInfo: DayInfo = {
  dayOfWeek: '',
  fullDate: '',
  historicalEvents: [],
  holidays: [],
  moonPhase: '',
  sunrise: '',
  sunset: ''
};

export default function WhatDayWasIt() {
  const [date, setDate] = useState<Date>(() => {
    // Use a fixed date for initial state to avoid hydration mismatch
    return new Date('2024-01-01');
  });
  const [showModal, setShowModal] = useState(false);
  const [dayInfo, setDayInfo] = useState<DayInfo>(initialDayInfo);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDayInfo = async () => {
      setIsLoading(true);
      const month = format(date, 'MM');
      const day = format(date, 'dd');
      
      try {
        // Fetch historical events
        let events: string[] = [];
        try {
          const eventsResponse = await fetch(`https://byabbe.se/on-this-day/${month}/${day}/events.json`);
          if (eventsResponse.ok) {
            const eventsData = await eventsResponse.json();
            events = eventsData.events.slice(0, 3).map((event: HistoricalEvent) => event.description);
          }
        } catch (error) {
          console.warn('Could not fetch historical events:', error);
        }

        // Fetch holidays
        let holidays: string[] = [];
        try {
          const holidaysResponse = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${date.getFullYear()}/US`);
          if (holidaysResponse.ok) {
            const holidaysData = await holidaysResponse.json();
            holidays = holidaysData
              .filter((holiday: Holiday) => holiday.date === format(date, 'yyyy-MM-dd'))
              .map((holiday: Holiday) => holiday.name);
          }
        } catch (error) {
          console.warn('Could not fetch holidays:', error);
        }

        // Fetch astronomical data
        let sunrise = '';
        let sunset = '';
        try {
          const lat = 40.7128; // New York coordinates as default
          const lng = -74.0060;
          const astroResponse = await fetch(
            `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=${format(date, 'yyyy-MM-dd')}`
          );
          if (astroResponse.ok) {
            const astroData = await astroResponse.json();
            sunrise = astroData.results.sunrise;
            sunset = astroData.results.sunset;
          }
        } catch (error) {
          console.warn('Could not fetch astronomical data:', error);
        }
        
        // Calculate moon phase
        const moonPhase = calculateMoonPhase(date);

        setDayInfo({
          dayOfWeek: format(date, 'EEEE'),
          fullDate: format(date, 'MMMM d, yyyy'),
          historicalEvents: events,
          holidays: holidays,
          moonPhase: moonPhase,
          sunrise: sunrise,
          sunset: sunset
        });
      } catch (error) {
        console.error('Error updating day info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDayInfo();
  }, [date]);

  const calculateMoonPhase = (date: Date) => {
    const LUNAR_MONTH = 29.530588853;
    const KNOWN_NEW_MOON = new Date('2000-01-06').getTime();
    const phase = ((date.getTime() - KNOWN_NEW_MOON) / (LUNAR_MONTH * 24 * 60 * 60 * 1000)) % 1;
    
    if (phase < 0.03 || phase >= 0.97) return 'New Moon';
    if (phase < 0.22) return 'Waxing Crescent';
    if (phase < 0.28) return 'First Quarter';
    if (phase < 0.47) return 'Waxing Gibbous';
    if (phase < 0.53) return 'Full Moon';
    if (phase < 0.72) return 'Waning Gibbous';
    if (phase < 0.78) return 'Last Quarter';
    return 'Waning Crescent';
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
              {dayInfo.fullDate || 'Loading...'}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Day Info Display */}
      <div className="grid grid-cols-2 md:grid-cols-3 w-full flex-1">
        <div className="relative h-full flex flex-col items-center justify-center border-r border-b border-gray-800 p-4">
          <motion.div 
            className="w-full h-full flex flex-col items-center justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="text-gray-400 text-base md:text-xl lg:text-2xl">Day of Week</div>
            <div className="text-white text-3xl md:text-5xl lg:text-6xl font-bold">
              {isLoading ? '...' : dayInfo.dayOfWeek}
            </div>
          </motion.div>
        </div>

        <div className="relative h-full flex flex-col items-center justify-center border-r border-b border-gray-800 p-4">
          <motion.div 
            className="w-full h-full flex flex-col items-center justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="text-gray-300 text-base md:text-xl lg:text-2xl">Moon Phase</div>
            <div className="text-white text-xl md:text-2xl lg:text-3xl font-bold">
              {isLoading ? '...' : dayInfo.moonPhase}
            </div>
          </motion.div>
        </div>

        <div className="relative h-full flex flex-col items-center justify-center border-b border-gray-800 p-4">
          <motion.div 
            className="w-full h-full flex flex-col items-center justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="text-gray-300 text-base md:text-xl lg:text-2xl">Sun Times</div>
            <div className="text-white text-xs md:text-sm lg:text-base">
              {isLoading ? '...' : (
                <table className="mt-2">
                  <tbody>
                    <tr>
                      <td className="pr-2">
                        <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </td>
                      <td className="text-gray-200">Rise:</td>
                      <td className="pl-2 text-gray-200">{dayInfo.sunrise || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="pr-2">
                        <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                      </td>
                      <td className="text-gray-200">Set:</td>
                      <td className="pl-2 text-gray-200">{dayInfo.sunset || 'N/A'}</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>
        </div>

        <div className="relative h-full flex flex-col items-center justify-center border-r border-b border-gray-800 p-4">
          <motion.div 
            className="w-full h-full flex flex-col items-center justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="text-gray-300 text-base md:text-xl lg:text-2xl">Holidays</div>
            <div className="text-white text-sm md:text-base lg:text-lg font-bold">
              {isLoading ? '...' : (
                dayInfo.holidays.length > 0 ? dayInfo.holidays.join(', ') : 'No holidays'
              )}
            </div>
          </motion.div>
        </div>

        <div className="relative h-full flex flex-col items-center justify-center border-b border-gray-800 p-4 col-span-2 md:col-span-2">
          <motion.div 
            className="w-full h-full flex flex-col items-center justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="text-gray-300 text-xs md:text-sm lg:text-base mb-1">Historical Events</div>
            <div className="text-white text-[10px] md:text-xs lg:text-sm max-w-[90%] leading-relaxed">
              {isLoading ? '...' : (
                dayInfo.historicalEvents.length > 0 
                  ? dayInfo.historicalEvents.map((event, index) => (
                      <div key={index} className="mb-0.5 text-gray-200">{event}</div>
                    ))
                  : 'No events found'
              )}
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
                  <StaticDatePicker
                    value={date}
                    onChange={(newValue) => {
                      if (newValue) {
                        setDate(newValue);
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