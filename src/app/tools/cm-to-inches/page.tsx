'use client';

import { useState } from 'react';
import ToolPageLayout from '@/app/components/ToolPageLayout';

export default function CmToInches() {
  const [cm, setCm] = useState('');
  const [inches, setInches] = useState('');

  const handleCmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCm(value);
    if (value === '') {
      setInches('');
    } else {
      const cmValue = parseFloat(value);
      if (!isNaN(cmValue)) {
        setInches((cmValue / 2.54).toFixed(2));
      }
    }
  };

  const handleInchesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInches(value);
    if (value === '') {
      setCm('');
    } else {
      const inchesValue = parseFloat(value);
      if (!isNaN(inchesValue)) {
        setCm((inchesValue * 2.54).toFixed(2));
      }
    }
  };

  return (
    <ToolPageLayout
      title="CM to Inches Converter"
      description="Convert between centimeters and inches with precision. Enter a value in either field to see the conversion."
    >
      <div className="space-y-6">
        <div>
          <label htmlFor="cm" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Centimeters (cm)
          </label>
          <input
            type="number"
            id="cm"
            value={cm}
            onChange={handleCmChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            placeholder="Enter length in centimeters"
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
            Enter a value in either centimeters or inches, and the other value will be automatically calculated.
            1 inch equals 2.54 centimeters.
          </p>
        </div>
      </div>
    </ToolPageLayout>
  );
} 