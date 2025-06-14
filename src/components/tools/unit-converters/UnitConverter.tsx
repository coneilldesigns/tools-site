'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NumericFormat } from 'react-number-format';

interface UnitConverterProps {
  fromUnit: string;
  toUnit: string;
  fromToConversion: (value: number) => number;
  toFromConversion: (value: number) => number;
  allowNegative?: boolean;
}

export default function UnitConverter({ 
  fromUnit, 
  toUnit, 
  fromToConversion, 
  toFromConversion,
  allowNegative = false 
}: UnitConverterProps) {
  const [fromValue, setFromValue] = useState<string>('');
  const [toValue, setToValue] = useState<string>('');
  const [textSize, setTextSize] = useState<string>('8vw');

  useEffect(() => {
    const maxLength = Math.max(fromValue.length, toValue.length);
    if (maxLength > 8) {
      setTextSize('8vw');
    } else if (maxLength > 6) {
      setTextSize('10vw');
    } else if (maxLength > 4) {
      setTextSize('12vw');
    } else {
      setTextSize('15vw');
    }
  }, [fromValue, toValue]);

  const formatNumber = (num: number): string => {
    const roundedToInt = Math.round(num);
    if (Math.abs(num - roundedToInt) < 0.0001) {
      return roundedToInt.toString();
    }
    return Number(num.toFixed(2)).toString();
  };

  const handleFromChange = (value: number | '') => {
    if (value === '') {
      setFromValue('');
      setToValue('');
      return;
    }
    setFromValue(value.toString());
    const convertedValue = fromToConversion(value);
    setToValue(formatNumber(convertedValue));
  };

  const handleToChange = (value: number | '') => {
    if (value === '') {
      setToValue('');
      setFromValue('');
      return;
    }
    setToValue(value.toString());
    const convertedValue = toFromConversion(value);
    setFromValue(formatNumber(convertedValue));
  };

  return (
    <div className="flex items-center justify-center h-[calc(100vh-8rem)] w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-center justify-between w-full h-full"
      >
        {/* From Unit Input */}
        <motion.div 
          className="relative w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-800"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="relative">
            <NumericFormat
              value={fromValue}
              onValueChange={({ floatValue }) => {
                handleFromChange(floatValue ?? '');
              }}
              placeholder="0"
              className="w-full font-bold text-center bg-transparent border-none focus:ring-0 focus:outline-none text-white placeholder-gray-600 overflow-hidden"
              style={{ fontSize: textSize }}
              decimalScale={2}
              allowNegative={allowNegative}
              allowLeadingZeros={false}
              valueIsNumericString={false}
            />
            <motion.div 
              className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm md:text-base font-medium text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {fromUnit}
            </motion.div>
          </div>
        </motion.div>

        {/* To Unit Input */}
        <motion.div 
          className="relative w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="relative">
            <NumericFormat
              value={toValue}
              onValueChange={({ floatValue }) => {
                handleToChange(floatValue ?? '');
              }}
              placeholder="0"
              className="w-full font-bold text-center bg-transparent border-none focus:ring-0 focus:outline-none text-white placeholder-gray-600 overflow-hidden"
              style={{ fontSize: textSize }}
              decimalScale={2}
              allowNegative={allowNegative}
              allowLeadingZeros={false}
              valueIsNumericString={false}
            />
            <motion.div 
              className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm md:text-base font-medium text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {toUnit}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
} 