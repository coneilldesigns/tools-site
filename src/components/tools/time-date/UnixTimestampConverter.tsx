'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export default function UnixTimestampConverter() {
  const [timestamp, setTimestamp] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [convertedDate, setConvertedDate] = useState<string>('');
  const [convertedTimestamp, setConvertedTimestamp] = useState<string>('');
  const [timestampError, setTimestampError] = useState<string>('');
  const [dateError, setDateError] = useState<string>('');

  useEffect(() => {
    if (timestamp) {
      try {
        const date = new Date(parseInt(timestamp) * 1000);
        if (isNaN(date.getTime())) {
          setTimestampError('Invalid timestamp');
          setConvertedDate('');
        } else {
          setTimestampError('');
          setConvertedDate(format(date, 'yyyy-MM-dd HH:mm:ss'));
        }
      } catch {
        setTimestampError('Invalid timestamp');
        setConvertedDate('');
      }
    }
  }, [timestamp]);

  useEffect(() => {
    if (date) {
      try {
        const timestamp = Math.floor(new Date(date).getTime() / 1000);
        if (isNaN(timestamp)) {
          setDateError('Invalid date');
          setConvertedTimestamp('');
        } else {
          setDateError('');
          setConvertedTimestamp(timestamp.toString());
        }
      } catch {
        setDateError('Invalid date');
        setConvertedTimestamp('');
      }
    }
  }, [date]);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="space-y-4">
          <div>
            <label htmlFor="timestamp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Unix Timestamp
            </label>
            <input
              type="text"
              id="timestamp"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              placeholder="Enter Unix timestamp"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white px-4 py-2"
            />
            {timestampError && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{timestampError}</p>
            )}
            {convertedDate && (
              <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                <p className="text-sm text-gray-500 dark:text-gray-400">Converted Date:</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{convertedDate}</p>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Date
            </label>
            <input
              type="datetime-local"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white px-4 py-2"
            />
            {dateError && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{dateError}</p>
            )}
            {convertedTimestamp && (
              <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                <p className="text-sm text-gray-500 dark:text-gray-400">Converted Timestamp:</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{convertedTimestamp}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 