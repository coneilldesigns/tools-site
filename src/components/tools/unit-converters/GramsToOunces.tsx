'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NumericFormat } from 'react-number-format';

export default function GramsToOunces() {
  const [grams, setGrams] = useState<string>('');
  const [ounces, setOunces] = useState<string>('');
  const [textSize, setTextSize] = useState<string>('8vw');

  useEffect(() => {
    const maxLength = Math.max(grams.length, ounces.length);
    if (maxLength > 8) {
      setTextSize('4vw');
    } else if (maxLength > 6) {
      setTextSize('5vw');
    } else if (maxLength > 4) {
      setTextSize('6vw');
    } else {
      setTextSize('8vw');
    }
  }, [grams, ounces]);

  const formatNumber = (num: number): string => {
    const roundedToInt = Math.round(num);
    if (Math.abs(num - roundedToInt) < 0.0001) {
      return roundedToInt.toString();
    }
    return Number(num.toFixed(2)).toString();
  };

  const handleGramsChange = (value: number | '') => {
    if (value === '') {
      setGrams('');
      setOunces('');
      return;
    }
    setGrams(value.toString());
    const ouncesNum = value / 28.3495;
    setOunces(formatNumber(ouncesNum));
  };

  const handleOuncesChange = (value: number | '') => {
    if (value === '') {
      setOunces('');
      setGrams('');
      return;
    }
    setOunces(value.toString());
    const gramsNum = value * 28.3495;
    setGrams(formatNumber(gramsNum));
  };

  return (
    <div className="flex items-center justify-center min-h-[50vh] w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between w-full px-4 md:px-8"
      >
        <motion.div 
          className="relative flex-1"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="relative">
            <NumericFormat
              value={grams}
              onValueChange={({ floatValue }) => {
                handleGramsChange(floatValue ?? '');
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
              GRAMS
            </motion.div>
          </div>
        </motion.div>

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

        <motion.div 
          className="relative flex-1"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="relative">
            <NumericFormat
              value={ounces}
              onValueChange={({ floatValue }) => {
                handleOuncesChange(floatValue ?? '');
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
              OZ
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
} 