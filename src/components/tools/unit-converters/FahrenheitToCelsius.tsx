'use client';

import { useState } from 'react';

export default function FahrenheitToCelsius() {
  const [fahrenheit, setFahrenheit] = useState<string>('');
  const [celsius, setCelsius] = useState<string>('');

  const handleFahrenheitChange = (value: string) => {
    setFahrenheit(value);
    if (value === '') {
      setCelsius('');
      return;
    }
    const fahrenheitNum = parseFloat(value);
    if (!isNaN(fahrenheitNum)) {
      setCelsius(((fahrenheitNum - 32) * 5/9).toFixed(2));
    }
  };

  const handleCelsiusChange = (value: string) => {
    setCelsius(value);
    if (value === '') {
      setFahrenheit('');
      return;
    }
    const celsiusNum = parseFloat(value);
    if (!isNaN(celsiusNum)) {
      setFahrenheit((celsiusNum * 9/5 + 32).toFixed(2));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="space-y-4">
          <div>
            <label htmlFor="fahrenheit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Fahrenheit
            </label>
            <input
              type="number"
              id="fahrenheit"
              value={fahrenheit}
              onChange={(e) => handleFahrenheitChange(e.target.value)}
              placeholder="Enter temperature in Fahrenheit"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white px-4 py-2"
              step="0.01"
            />
          </div>

          <div>
            <label htmlFor="celsius" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Celsius
            </label>
            <input
              type="number"
              id="celsius"
              value={celsius}
              onChange={(e) => handleCelsiusChange(e.target.value)}
              placeholder="Enter temperature in Celsius"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white px-4 py-2"
              step="0.01"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 