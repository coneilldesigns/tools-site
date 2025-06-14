'use client';

import { useState } from 'react';
import ToolPageLayout from '@/app/components/ToolPageLayout';

export default function MilesToKm() {
  const [miles, setMiles] = useState('');
  const [kilometers, setKilometers] = useState('');

  const handleMilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMiles(value);
    if (value === '') {
      setKilometers('');
    } else {
      const milesValue = parseFloat(value);
      if (!isNaN(milesValue)) {
        setKilometers((milesValue * 1.60934).toFixed(2));
      }
    }
  };

  const handleKilometersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKilometers(value);
    if (value === '') {
      setMiles('');
    } else {
      const kmValue = parseFloat(value);
      if (!isNaN(kmValue)) {
        setMiles((kmValue / 1.60934).toFixed(2));
      }
    }
  };

  return (
    <ToolPageLayout
      title="Miles to Kilometers Converter"
      description="Convert between miles and kilometers with precision. Enter a value in either field to see the conversion."
    >
      <div className="space-y-6">
        <div>
          <label htmlFor="miles" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Miles (mi)
          </label>
          <input
            type="number"
            id="miles"
            value={miles}
            onChange={handleMilesChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            placeholder="Enter distance in miles"
            step="0.01"
          />
        </div>

        <div>
          <label htmlFor="kilometers" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Kilometers (km)
          </label>
          <input
            type="number"
            id="kilometers"
            value={kilometers}
            onChange={handleKilometersChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            placeholder="Enter distance in kilometers"
            step="0.01"
          />
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">How to use</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Enter a value in either miles or kilometers, and the other value will be automatically calculated.
            1 mile equals 1.60934 kilometers.
          </p>
        </div>
      </div>
    </ToolPageLayout>
  );
} 