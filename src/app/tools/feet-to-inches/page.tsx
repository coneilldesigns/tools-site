'use client';

import { useState } from 'react';
import ToolPageLayout from '@/app/components/ToolPageLayout';

export default function FeetToInches() {
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');

  const handleFeetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFeet(value);
    if (value === '') {
      setInches('');
    } else {
      const feetValue = parseFloat(value);
      if (!isNaN(feetValue)) {
        setInches((feetValue * 12).toFixed(2));
      }
    }
  };

  const handleInchesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInches(value);
    if (value === '') {
      setFeet('');
    } else {
      const inchesValue = parseFloat(value);
      if (!isNaN(inchesValue)) {
        setFeet((inchesValue / 12).toFixed(2));
      }
    }
  };

  return (
    <ToolPageLayout
      title="Feet to Inches Converter"
      description="Convert between feet and inches with ease. Enter a value in either field to see the conversion."
    >
      <div className="space-y-6">
        <div>
          <label htmlFor="feet" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Feet (ft)
          </label>
          <input
            type="number"
            id="feet"
            value={feet}
            onChange={handleFeetChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            placeholder="Enter length in feet"
            step="0.01"
          />
        </div>

        <div>
          <label htmlFor="inches" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Inches (in)
          </label>
          <input
            type="number"
            id="inches"
            value={inches}
            onChange={handleInchesChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            placeholder="Enter length in inches"
            step="0.01"
          />
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">How to use</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Enter a value in either feet or inches, and the other value will be automatically calculated.
            1 foot equals 12 inches.
          </p>
        </div>
      </div>
    </ToolPageLayout>
  );
} 