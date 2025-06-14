'use client';

import { useState } from 'react';

export default function GramsToOunces() {
  const [grams, setGrams] = useState<string>('');
  const [ounces, setOunces] = useState<string>('');

  const handleGramsChange = (value: string) => {
    setGrams(value);
    if (value === '') {
      setOunces('');
      return;
    }
    const gramsNum = parseFloat(value);
    if (!isNaN(gramsNum)) {
      setOunces((gramsNum / 28.3495).toFixed(2));
    }
  };

  const handleOuncesChange = (value: string) => {
    setOunces(value);
    if (value === '') {
      setGrams('');
      return;
    }
    const ouncesNum = parseFloat(value);
    if (!isNaN(ouncesNum)) {
      setGrams((ouncesNum * 28.3495).toFixed(2));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="space-y-4">
          <div>
            <label htmlFor="grams" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Grams
            </label>
            <input
              type="number"
              id="grams"
              value={grams}
              onChange={(e) => handleGramsChange(e.target.value)}
              placeholder="Enter weight in grams"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white px-4 py-2"
              step="0.01"
            />
          </div>

          <div>
            <label htmlFor="ounces" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Ounces
            </label>
            <input
              type="number"
              id="ounces"
              value={ounces}
              onChange={(e) => handleOuncesChange(e.target.value)}
              placeholder="Enter weight in ounces"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white px-4 py-2"
              step="0.01"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 