'use client';

import { useState, useEffect } from 'react';
import { format, toZonedTime } from 'date-fns-tz';

export default function TimeZoneConverter() {
  const [fromTimeZone, setFromTimeZone] = useState<string>('UTC');
  const [toTimeZone, setToTimeZone] = useState<string>('America/New_York');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [convertedTime, setConvertedTime] = useState<string>('');

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
    if (date && time) {
      const dateTime = new Date(`${date}T${time}`);
      const zonedTime = toZonedTime(dateTime, toTimeZone);
      setConvertedTime(format(zonedTime, 'yyyy-MM-dd HH:mm:ss zzz', { timeZone: toTimeZone }));
    }
  }, [date, time, toTimeZone]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="space-y-4">
          <div>
            <label htmlFor="fromTimeZone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              From Time Zone
            </label>
            <select
              id="fromTimeZone"
              value={fromTimeZone}
              onChange={(e) => setFromTimeZone(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white px-4 py-2"
            >
              {timeZones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={handleDateChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white px-4 py-2"
            />
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Time
            </label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={handleTimeChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white px-4 py-2"
            />
          </div>

          <div>
            <label htmlFor="toTimeZone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              To Time Zone
            </label>
            <select
              id="toTimeZone"
              value={toTimeZone}
              onChange={(e) => setToTimeZone(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white px-4 py-2"
            >
              {timeZones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>

          {convertedTime && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Converted Time:</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{convertedTime}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 