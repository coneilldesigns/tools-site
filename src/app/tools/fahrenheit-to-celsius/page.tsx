'use client';

import { useState } from 'react';
import ToolPageLayout from '@/app/components/ToolPageLayout';

export default function FahrenheitToCelsius() {
  const [fahrenheit, setFahrenheit] = useState('');
  const [celsius, setCelsius] = useState('');

  const handleFahrenheitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFahrenheit(value);
    if (value === '') {
      setCelsius('');
    } else {
      const fahrenheitValue = parseFloat(value);
      if (!isNaN(fahrenheitValue)) {
        setCelsius(((fahrenheitValue - 32) * 5/9).toFixed(2));
      }
    }
  };

  const handleCelsiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCelsius(value);
    if (value === '') {
      setFahrenheit('');
    } else {
      const celsiusValue = parseFloat(value);
      if (!isNaN(celsiusValue)) {
        setFahrenheit(((celsiusValue * 9/5) + 32).toFixed(2));
      }
    }
  };

  return (
    <ToolPageLayout
      title="Fahrenheit to Celsius Converter"
      description="Convert between Fahrenheit and Celsius temperature scales. Enter a value in either field to see the conversion."
    >
      <div className="space-y-6">
        <div>
          <label htmlFor="fahrenheit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Fahrenheit (°F)
          </label>
          <input
            type="number"
            id="fahrenheit"
            value={fahrenheit}
            onChange={handleFahrenheitChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            placeholder="Enter temperature in Fahrenheit"
            step="0.1"
          />
        </div>

        <div>
          <label htmlFor="celsius" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Celsius (°C)
          </label>
          <input
            type="number"
            id="celsius"
            value={celsius}
            onChange={handleCelsiusChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            placeholder="Enter temperature in Celsius"
            step="0.1"
          />
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">How to use</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Enter a value in either Fahrenheit or Celsius, and the other value will be automatically calculated.
            To convert from Fahrenheit to Celsius: (°F - 32) × 5/9 = °C
            To convert from Celsius to Fahrenheit: (°C × 9/5) + 32 = °F
          </p>
        </div>
      </div>
    </ToolPageLayout>
  );
} 