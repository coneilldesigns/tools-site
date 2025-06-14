'use client';

import { useState } from 'react';


export default function MilesToKm() {
  const [miles, setMiles] = useState<string>('');
  const [kilometers, setKilometers] = useState<string>('');

  const handleMilesChange = (value: string) => {
    setMiles(value);
    if (value === '') {
      setKilometers('');
      return;
    }
    const milesNum = parseFloat(value);
    if (!isNaN(milesNum)) {
      setKilometers((milesNum * 1.60934).toFixed(2));
    }
  };

  const handleKilometersChange = (value: string) => {
    setKilometers(value);
    if (value === '') {
      setMiles('');
      return;
    }
    const kmNum = parseFloat(value);
    if (!isNaN(kmNum)) {
      setMiles((kmNum / 1.60934).toFixed(2));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="space-y-4">
          <div>
            <label htmlFor="miles" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Miles
            </label>
            <input
              type="number"
              id="miles"
              value={miles}
              onChange={(e) => handleMilesChange(e.target.value)}
              placeholder="Enter miles"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white px-4 py-2"
              step="0.01"
            />
          </div>

          <div>
            <label htmlFor="kilometers" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Kilometers
            </label>
            <input
              type="number"
              id="kilometers"
              value={kilometers}
              onChange={(e) => handleKilometersChange(e.target.value)}
              placeholder="Enter kilometers"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white px-4 py-2"
              step="0.01"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 