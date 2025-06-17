'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function BmiCalculator() {
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [feet, setFeet] = useState<string>('');
  const [inches, setInches] = useState<string>('');

  const calculateBMI = () => {
    const weightValue = parseFloat(weight) || 0;
    let heightValue: number;

    if (unit === 'metric') {
      heightValue = parseFloat(height) || 0;
    } else {
      // Convert feet and inches to total inches
      const feetValue = parseInt(feet) || 0;
      const inchesValue = parseInt(inches) || 0;
      heightValue = (feetValue * 12) + inchesValue;
    }

    if (heightValue === 0 || weightValue === 0) {
      return {
        bmi: '0',
        category: 'Enter your measurements',
        color: 'text-gray-400',
        details: 'Please enter your height and weight to calculate your BMI.'
      };
    }

    let bmi: number;
    if (unit === 'metric') {
      // Weight in kg, height in cm
      bmi = weightValue / Math.pow(heightValue / 100, 2);
    } else {
      // Weight in lbs, height in inches
      bmi = (weightValue * 703) / Math.pow(heightValue, 2);
    }

    let category: string;
    let color: string;
    let details: string;

    if (bmi < 18.5) {
      category = 'Underweight';
      color = 'text-blue-400';
      details = 'BMI less than 18.5';
    } else if (bmi < 25) {
      category = 'Healthy Weight';
      color = 'text-green-400';
      details = 'BMI 18.5 to less than 25';
    } else if (bmi < 30) {
      category = 'Overweight';
      color = 'text-yellow-400';
      details = 'BMI 25 to less than 30';
    } else if (bmi < 35) {
      category = 'Class 1 Obesity';
      color = 'text-orange-400';
      details = 'BMI 30 to less than 35';
    } else if (bmi < 40) {
      category = 'Class 2 Obesity';
      color = 'text-red-400';
      details = 'BMI 35 to less than 40';
    } else {
      category = 'Class 3 Obesity (Severe)';
      color = 'text-red-600';
      details = 'BMI 40 or greater';
    }

    return {
      bmi: bmi.toFixed(1),
      category,
      color,
      details
    };
  };

  const results = calculateBMI();

  const handleUnitChange = (newUnit: 'metric' | 'imperial') => {
    setUnit(newUnit);
    // Clear height inputs when switching units
    if (newUnit === 'metric') {
      setFeet('');
      setInches('');
    } else {
      setHeight('');
    }
  };

  return (
    <div className="flex flex-col w-full h-full m-0">
      {/* Input Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border-b border-gray-800">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Unit System
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['metric', 'imperial'].map((u) => (
              <button
                key={u}
                onClick={() => handleUnitChange(u as 'metric' | 'imperial')}
                className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                  unit === u
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {u.charAt(0).toUpperCase() + u.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Height
          </label>
          {unit === 'metric' ? (
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full rounded-lg bg-gray-800 border-gray-700 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Height in cm"
              min="0"
              step="0.1"
            />
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <input
                  type="number"
                  value={feet}
                  onChange={(e) => setFeet(e.target.value)}
                  className="w-full rounded-lg bg-gray-800 border-gray-700 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Feet"
                  min="0"
                />
                <span className="text-xs text-gray-400 mt-1 block">Feet</span>
              </div>
              <div>
                <input
                  type="number"
                  value={inches}
                  onChange={(e) => setInches(e.target.value)}
                  className="w-full rounded-lg bg-gray-800 border-gray-700 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Inches"
                  min="0"
                  max="11"
                />
                <span className="text-xs text-gray-400 mt-1 block">Inches</span>
              </div>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-300 mb-2">
            Weight ({unit === 'metric' ? 'kg' : 'lbs'})
          </label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full rounded-lg bg-gray-800 border-gray-700 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
            min="0"
            step="0.1"
          />
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 w-full flex-1">
        <div className="relative h-full flex flex-col items-center justify-center border-r border-b md:border-b-0 border-gray-800">
          <motion.div 
            className="w-full h-full flex flex-col items-center justify-center text-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="text-gray-300 text-base md:text-xl lg:text-2xl">BMI</div>
            <div className="text-white text-3xl md:text-5xl lg:text-6xl font-bold">{results.bmi}</div>
          </motion.div>
        </div>
        <div className="relative h-full flex flex-col items-center justify-center border-b border-gray-800">
          <motion.div 
            className="w-full h-full flex flex-col items-center justify-center text-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="text-gray-300 text-base md:text-xl lg:text-2xl">Category</div>
            <div className={`text-2xl md:text-3xl lg:text-4xl font-bold ${results.color}`}>
              {results.category}
            </div>
            <div className="text-gray-400 text-sm md:text-base mt-2">
              {results.details}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-4 border-t border-gray-800 text-sm text-gray-400">
        <p className="mb-2">Note: BMI is a screening measure and should be considered with other factors when assessing an individual&apos;s health. If you have questions about your BMI, talk with your health care provider.</p>
        <p>Source: Centers for Disease Control and Prevention (CDC)</p>
      </div>
    </div>
  );
}
