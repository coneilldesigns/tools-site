'use client';

import { useState, useEffect } from 'react';
import ToolPageLayout from '@/app/components/ToolPageLayout';

export default function TimeZoneConverter() {
  const [fromTime, setFromTime] = useState('');
  const [fromZone, setFromZone] = useState('UTC');
  const [toZone, setToZone] = useState('UTC');
  const [convertedTime, setConvertedTime] = useState('');

  const timeZones = [
    'UTC',
    'America/New_York',
    'America/Los_Angeles',
    'America/Chicago',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Australia/Sydney',
    'Pacific/Auckland'
  ];

  useEffect(() => {
    if (fromTime && fromZone && toZone) {
      try {
        const date = new Date(fromTime);
        const fromDate = new Date(date.toLocaleString('en-US', { timeZone: fromZone }));
        const toDate = new Date(date.toLocaleString('en-US', { timeZone: toZone }));
        
        const timeString = toDate.toLocaleTimeString('en-US', {
          hour12: true,
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          timeZone: toZone
        });

        setConvertedTime(timeString);
      } catch (error) {
        setConvertedTime('Invalid time or timezone');
      }
    }
  }, [fromTime, fromZone, toZone]);

  return (
    <ToolPageLayout
      title="Time Zone Converter"
      description="Convert times between different time zones easily. Select your source time zone and target time zone to see the conversion."
    >
      <div className="space-y-6">
        <div>
          <label htmlFor="fromTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Time
          </label>
          <input
            type="datetime-local"
            id="fromTime"
            value={fromTime}
            onChange={(e) => setFromTime(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="fromZone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              From Time Zone
            </label>
            <select
              id="fromZone"
              value={fromZone}
              onChange={(e) => setFromZone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            >
              {timeZones.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="toZone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To Time Zone
            </label>
            <select
              id="toZone"
              value={toZone}
              onChange={(e) => setToZone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            >
              {timeZones.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </div>
        </div>

        {convertedTime && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Converted Time
            </h3>
            <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {convertedTime}
            </p>
          </div>
        )}

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">How to use</h2>
          <p className="text-gray-600 dark:text-gray-300">
            1. Enter the time you want to convert<br />
            2. Select the source time zone<br />
            3. Select the target time zone<br />
            4. The converted time will be displayed automatically
          </p>
        </div>
      </div>
    </ToolPageLayout>
  );
} 