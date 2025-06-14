'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NumericFormat } from 'react-number-format';

export default function MilesToKm() {
  const [miles, setMiles] = useState<string>('');
  const [km, setKm] = useState<string>('');
  const [textSize, setTextSize] = useState<string>('8vw');

  useEffect(() => {
    const maxLength = Math.max(miles.length, km.length);
    if (maxLength > 8) {
      setTextSize('4vw');
    } else if (maxLength > 6) {
      setTextSize('5vw');
    } else if (maxLength > 4) {
      setTextSize('6vw');
    } else {
      setTextSize('8vw');
    }
  }, [miles, km]);

  const formatNumber = (num: number): string => {
    const roundedToInt = Math.round(num);
    if (Math.abs(num - roundedToInt) < 0.0001) {
      return roundedToInt.toString();
    }
    return Number(num.toFixed(2)).toString();
  };

  const handleMilesChange = (value: number | '') => {
    if (value === '') {
      setMiles('');
      setKm('');
      return;
    }
    setMiles(value.toString());
    const kmNum = value * 1.60934;
    setKm(formatNumber(kmNum));
  };

  const handleKmChange = (value: number | '') => {
    if (value === '') {
      setKm('');
      setMiles('');
      return;
    }
    setKm(value.toString());
    const milesNum = value / 1.60934;
    setMiles(formatNumber(milesNum));
  };

  return (
    <div className="flex items-center justify-center min-h-[50vh] w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between w-full px-4 md:px-8"
      >
        {/* Miles Input */}
        <motion.div 
          className="relative flex-1"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="relative">
            <NumericFormat
              value={miles}
              onValueChange={({ floatValue }) => {
                handleMilesChange(floatValue ?? '');
              }}
              placeholder="0"
              className="w-full aspect-square min-w-[120px] font-bold text-center bg-transparent border-none focus:ring-0 focus:outline-none text-white placeholder-gray-600 overflow-hidden mx-auto"
              style={{ fontSize: textSize }}
              decimalScale={2}
              allowNegative={false}
              allowLeadingZeros={false}
              valueIsNumericString={false}
            />
            <motion.div 
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-sm md:text-base font-medium text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              MILES
            </motion.div>
          </div>
        </motion.div>

        {/* Separator */}
        <motion.div 
          className="font-bold text-gray-600 px-8"
          style={{ fontSize: textSize }}
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          /
        </motion.div>

        {/* KM Input */}
        <motion.div 
          className="relative flex-1"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="relative">
            <NumericFormat
              value={km}
              onValueChange={({ floatValue }) => {
                handleKmChange(floatValue ?? '');
              }}
              placeholder="0"
              className="w-full aspect-square min-w-[120px] font-bold text-center bg-transparent border-none focus:ring-0 focus:outline-none text-white placeholder-gray-600 overflow-hidden mx-auto"
              style={{ fontSize: textSize }}
              decimalScale={2}
              allowNegative={false}
              allowLeadingZeros={false}
              valueIsNumericString={false}
            />
            <motion.div 
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-sm md:text-base font-medium text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              KM
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
} 