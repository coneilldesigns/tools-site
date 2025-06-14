'use client';

import { useState } from 'react';
import ToolPageLayout from '@/app/components/ToolPageLayout';

export default function GramsToOunces() {
  const [grams, setGrams] = useState('');
  const [ounces, setOunces] = useState('');

  const handleGramsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGrams(value);
    if (value === '') {
      setOunces('');
    } else {
      const gramsValue = parseFloat(value);
      if (!isNaN(gramsValue)) {
        setOunces((gramsValue * 0.035274).toFixed(4));
      }
    }
  };

  const handleOuncesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOunces(value);
    if (value === '') {
      setGrams('');
    } else {
      const ouncesValue = parseFloat(value);
      if (!isNaN(ouncesValue)) {
        setGrams((ouncesValue / 0.035274).toFixed(2));
      }
    }
  };

  return (
    <ToolPageLayout
      title="Grams to Ounces Converter"
      description="Convert between grams and ounces with precision. Enter a value in either field to see the conversion."
    >
      <div className="space-y-6">
        <div>
          <label htmlFor="grams" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Grams (g)
          </label>
          <input
            type="number"
            id="grams"
            value={grams}
            onChange={handleGramsChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            placeholder="Enter weight in grams"
            step="0.01"
          />
        </div>

        <div>
          <label htmlFor="ounces" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ounces (oz)
          </label>
          <input
            type="number"
            id="ounces"
            value={ounces}
            onChange={handleOuncesChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            placeholder="Enter weight in ounces"
            step="0.0001"
          />
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">How to use</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Enter a value in either grams or ounces, and the other value will be automatically calculated.
            1 gram equals 0.035274 ounces.
            This converter is particularly useful for cooking and baking measurements.
          </p>
        </div>
      </div>
    </ToolPageLayout>
  );
} 