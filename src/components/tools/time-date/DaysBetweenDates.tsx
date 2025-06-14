'use client';

import { useState, useEffect } from 'react';
import { differenceInDays, differenceInMonths, differenceInYears } from 'date-fns';

export default function DaysBetweenDates() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [difference, setDifference] = useState({
    years: 0,
    months: 0,
    days: 0
  });

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      const years = differenceInYears(end, start);
      const months = differenceInMonths(end, start) % 12;
      const days = differenceInDays(end, start) % 30;

      setDifference({ years, months, days });
    }
  }, [startDate, endDate]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white px-4 py-2"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white px-4 py-2"
          />
        </div>
      </div>

      {startDate && endDate && (
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-white dark:bg-gray-700 shadow-sm">
            <div className="text-sm text-gray-500 dark:text-gray-400">Years</div>
            <div className="text-2xl font-semibold text-gray-900 dark:text-white">{difference.years}</div>
          </div>
          <div className="p-4 rounded-lg bg-white dark:bg-gray-700 shadow-sm">
            <div className="text-sm text-gray-500 dark:text-gray-400">Months</div>
            <div className="text-2xl font-semibold text-gray-900 dark:text-white">{difference.months}</div>
          </div>
          <div className="p-4 rounded-lg bg-white dark:bg-gray-700 shadow-sm">
            <div className="text-sm text-gray-500 dark:text-gray-400">Days</div>
            <div className="text-2xl font-semibold text-gray-900 dark:text-white">{difference.days}</div>
          </div>
        </div>
      )}
    </div>
  );
} 