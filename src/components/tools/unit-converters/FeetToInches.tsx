'use client';

import { useState } from 'react';


export default function FeetToInches() {
  const [feet, setFeet] = useState<string>('');
  const [inches, setInches] = useState<string>('');

  const handleFeetChange = (value: string) => {
    setFeet(value);
    if (value === '') {
      setInches('');
      return;
    }
    const feetNum = parseFloat(value);
    if (!isNaN(feetNum)) {
      setInches((feetNum * 12).toFixed(2));
    }
  };

  const handleInchesChange = (value: string) => {
    setInches(value);
    if (value === '') {
      setFeet('');
      return;
    }
    const inchesNum = parseFloat(value);
    if (!isNaN(inchesNum)) {
      setFeet((inchesNum / 12).toFixed(2));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="space-y-4">
          <div>
            <label htmlFor="feet" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Feet
            </label>
            <input
              type="number"
              id="feet"
              value={feet}
              onChange={(e) => handleFeetChange(e.target.value)}
              placeholder="Enter feet"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white px-4 py-2"
              step="0.01"
            />
          </div>

          <div>
            <label htmlFor="inches" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Inches
            </label>
            <input
              type="number"
              id="inches"
              value={inches}
              onChange={(e) => handleInchesChange(e.target.value)}
              placeholder="Enter inches"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white px-4 py-2"
              step="0.01"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 