'use client';

import { useState } from 'react';
import ToolPageLayout from '@/app/components/ToolPageLayout';

export default function LitresToGallons() {
  const [litres, setLitres] = useState('');
  const [gallons, setGallons] = useState('');

  const handleLitresChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLitres(value);
    if (value === '') {
      setGallons('');
    } else {
      const litresValue = parseFloat(value);
      if (!isNaN(litresValue)) {
        setGallons((litresValue * 0.264172).toFixed(4));
      }
    }
  };

  const handleGallonsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGallons(value);
    if (value === '') {
      setLitres('');
    } else {
      const gallonsValue = parseFloat(value);
      if (!isNaN(gallonsValue)) {
        setLitres((gallonsValue / 0.264172).toFixed(2));
      }
    }
  };

  return (
    <ToolPageLayout
      title="Litres to Gallons Converter"
      description="Convert between litres and gallons with precision. Enter a value in either field to see the conversion."
    >
      <div className="space-y-6">
        <div>
          <label htmlFor="litres" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Litres (L)
          </label>
          <input
            type="number"
            id="litres"
            value={litres}
            onChange={handleLitresChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            placeholder="Enter volume in litres"
            step="0.01"
          />
        </div>

        <div>
          <label htmlFor="gallons" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Gallons (gal)
          </label>
          <input
            type="number"
            id="gallons"
            value={gallons}
            onChange={handleGallonsChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            placeholder="Enter volume in gallons"
            step="0.0001"
          />
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">How to use</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Enter a value in either litres or gallons, and the other value will be automatically calculated.
            1 litre equals 0.264172 gallons.
          </p>
        </div>
      </div>
    </ToolPageLayout>
  );
} 