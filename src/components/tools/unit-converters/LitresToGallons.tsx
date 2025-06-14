'use client';

import { useState } from 'react';

export default function LitresToGallons() {
  const [litres, setLitres] = useState<string>('');
  const [gallons, setGallons] = useState<string>('');

  const handleLitresChange = (value: string) => {
    setLitres(value);
    if (value === '') {
      setGallons('');
      return;
    }
    const litresNum = parseFloat(value);
    if (!isNaN(litresNum)) {
      setGallons((litresNum / 3.78541).toFixed(2));
    }
  };

  const handleGallonsChange = (value: string) => {
    setGallons(value);
    if (value === '') {
      setLitres('');
      return;
    }
    const gallonsNum = parseFloat(value);
    if (!isNaN(gallonsNum)) {
      setLitres((gallonsNum * 3.78541).toFixed(2));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="space-y-4">
          <div>
            <label htmlFor="litres" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Litres
            </label>
            <input
              type="number"
              id="litres"
              value={litres}
              onChange={(e) => handleLitresChange(e.target.value)}
              placeholder="Enter volume in litres"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white px-4 py-2"
              step="0.01"
            />
          </div>

          <div>
            <label htmlFor="gallons" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Gallons
            </label>
            <input
              type="number"
              id="gallons"
              value={gallons}
              onChange={(e) => handleGallonsChange(e.target.value)}
              placeholder="Enter volume in gallons"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white px-4 py-2"
              step="0.01"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 