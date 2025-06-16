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
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const maxLength = Math.max(fromValue.length, toValue.length);
    if (isMobile) {
      if (maxLength > 8) {
        setTextSize('12vw');
      } else if (maxLength > 6) {
        setTextSize('14vw');
      } else if (maxLength > 4) {
        setTextSize('16vw');
      } else {
        setTextSize('18vw');
      }
    } else {
      if (maxLength > 8) {
        setTextSize('8vw');
      } else if (maxLength > 6) {
        setTextSize('9vw');
      } else if (maxLength > 4) {
        setTextSize('10vw');
      } else {
        setTextSize('11vw');
      }
    }
  }, [fromValue, toValue, isMobile]);

  const formatNumber = (num: number): string => {
    const roundedToInt = Math.round(num);
    if (Math.abs(num - roundedToInt) < 0.0001) {
      return roundedToInt.toString();
    }
    if (Math.abs(num) < 1) {
      return num.toFixed(4).replace(/\.?0+$/, '');
    }
    return num.toFixed(2).replace(/\.?0+$/, '');
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
    <div className="flex items-center justify-center w-full mb-0 flex-1">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-center justify-between w-full h-full"
      >
        {/* From Unit Input */}
        <div className="relative w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-800">
          <motion.div 
            className="w-full h-full flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="relative h-full">
              <NumericFormat
                value={fromValue}
                onValueChange={({ floatValue }) => {
                  handleFromChange(floatValue ?? '');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' || e.key === 'Delete') {
                    e.preventDefault();
                    handleFromChange('');
                  }
                }}
                placeholder="0"
                className="w-full h-full font-bold text-center bg-transparent border-none focus:ring-0 focus:outline-none text-white placeholder-gray-600 overflow-hidden"
                style={{ fontSize: textSize }}
                decimalScale={8}
                allowNegative={allowNegative}
                allowLeadingZeros={false}
                valueIsNumericString={false}
              />
              <motion.div 
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-sm md:text-base font-medium text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {fromUnit}
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* To Unit Input */}
        <div className="relative w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center">
          <motion.div 
            className="w-full h-full flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="relative h-full">
              <NumericFormat
                value={toValue}
                onValueChange={({ floatValue }) => {
                  handleToChange(floatValue ?? '');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' || e.key === 'Delete') {
                    e.preventDefault();
                    handleToChange('');
                  }
                }}
                placeholder="0"
                className="w-full  h-full font-bold text-center bg-transparent border-none focus:ring-0 focus:outline-none text-white placeholder-gray-600 overflow-hidden"
                style={{ fontSize: textSize }}
                decimalScale={8}
                allowNegative={allowNegative}
                allowLeadingZeros={false}
                valueIsNumericString={false}
              />
              <motion.div 
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-sm md:text-base font-medium text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {toUnit}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
} 