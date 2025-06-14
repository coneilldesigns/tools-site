'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function WhatDayWasIt() {
  const [date, setDate] = useState<string>('');
  const [dayInfo, setDayInfo] = useState<{
    dayOfWeek: string;
    fullDate: string;
  } | null>(null);

  useEffect(() => {
    if (date) {
      const selectedDate = new Date(date);
      setDayInfo({
        dayOfWeek: format(selectedDate, 'EEEE'),
        fullDate: format(selectedDate, 'MMMM d, yyyy')
      });
    }
  }, [date]);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="space-y-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white px-4 py-2"
            />
          </div>

          {dayInfo && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <p className="text-sm text-gray-500 dark:text-gray-400">Day of Week:</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{dayInfo.dayOfWeek}</p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Full Date:</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">{dayInfo.fullDate}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 