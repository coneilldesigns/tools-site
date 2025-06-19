'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NumericFormat } from 'react-number-format';

type CSSUnit = 'px' | 'rem' | 'em' | 'vw' | 'vh' | 'pt' | 'in' | 'pc' | 'cm' | 'mm' | 'percent';

interface ConversionFactors {
  [key: string]: {
    [key: string]: (value: number, baseFontSize?: number, viewportWidth?: number, viewportHeight?: number) => number;
  };
}

const conversionFactors: ConversionFactors = {
  px: {
    rem: (value: number, baseFontSize: number = 16) => value / baseFontSize,
    em: (value: number, baseFontSize: number = 16) => value / baseFontSize,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    vw: (value: number, _baseFontSize: number = 16, viewportWidth: number = 1920) => (value / viewportWidth) * 100,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    vh: (value: number, _baseFontSize: number = 16, _viewportWidth: number = 1920, viewportHeight: number = 1080) => (value / viewportHeight) * 100,
    pt: (value: number) => value * 0.75,
    in: (value: number) => value / 96,
    pc: (value: number) => value / 16,
    cm: (value: number) => value / 37.795275591,
    mm: (value: number) => value / 3.7795275591,
    percent: (value: number, baseFontSize: number = 16) => (value / baseFontSize) * 100
  },
  rem: {
    px: (value: number, baseFontSize: number = 16) => value * baseFontSize,
    em: (value: number) => value,
    vw: (value: number, baseFontSize: number = 16, viewportWidth: number = 1920) => (value * baseFontSize / viewportWidth) * 100,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    vh: (value: number, baseFontSize: number = 16, _viewportWidth: number = 1920, viewportHeight: number = 1080) => (value * baseFontSize / viewportHeight) * 100,
    pt: (value: number, baseFontSize: number = 16) => value * baseFontSize * 0.75,
    in: (value: number, baseFontSize: number = 16) => (value * baseFontSize) / 96,
    pc: (value: number, baseFontSize: number = 16) => (value * baseFontSize) / 16,
    cm: (value: number, baseFontSize: number = 16) => (value * baseFontSize) / 37.795275591,
    mm: (value: number, baseFontSize: number = 16) => (value * baseFontSize) / 3.7795275591,
    percent: (value: number) => value * 100
  },
  em: {
    px: (value: number, baseFontSize: number = 16) => value * baseFontSize,
    rem: (value: number) => value,
    vw: (value: number, baseFontSize: number = 16, viewportWidth: number = 1920) => (value * baseFontSize / viewportWidth) * 100,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    vh: (value: number, baseFontSize: number = 16, _viewportWidth: number = 1920, viewportHeight: number = 1080) => (value * baseFontSize / viewportHeight) * 100,
    pt: (value: number, baseFontSize: number = 16) => value * baseFontSize * 0.75,
    in: (value: number, baseFontSize: number = 16) => (value * baseFontSize) / 96,
    pc: (value: number, baseFontSize: number = 16) => (value * baseFontSize) / 16,
    cm: (value: number, baseFontSize: number = 16) => (value * baseFontSize) / 37.795275591,
    mm: (value: number, baseFontSize: number = 16) => (value * baseFontSize) / 3.7795275591,
    percent: (value: number) => value * 100
  },
  vw: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    px: (value: number, _baseFontSize: number = 16, viewportWidth: number = 1920) => (value / 100) * viewportWidth,
    rem: (value: number, baseFontSize: number = 16, viewportWidth: number = 1920) => ((value / 100) * viewportWidth) / baseFontSize,
    em: (value: number, baseFontSize: number = 16, viewportWidth: number = 1920) => ((value / 100) * viewportWidth) / baseFontSize,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    vh: (value: number, _baseFontSize: number = 16, viewportWidth: number = 1920, viewportHeight: number = 1080) => (value / 100) * (viewportWidth / viewportHeight) * 100,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    pt: (value: number, _baseFontSize: number = 16, viewportWidth: number = 1920) => ((value / 100) * viewportWidth) * 0.75,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    in: (value: number, _baseFontSize: number = 16, viewportWidth: number = 1920) => ((value / 100) * viewportWidth) / 96,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    pc: (value: number, _baseFontSize: number = 16, viewportWidth: number = 1920) => ((value / 100) * viewportWidth) / 16,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cm: (value: number, _baseFontSize: number = 16, viewportWidth: number = 1920) => ((value / 100) * viewportWidth) / 37.795275591,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mm: (value: number, _baseFontSize: number = 16, viewportWidth: number = 1920) => ((value / 100) * viewportWidth) / 3.7795275591,
    percent: (value: number, baseFontSize: number = 16, viewportWidth: number = 1920) => ((value / 100) * viewportWidth) / baseFontSize * 100
  },
  vh: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    px: (value: number, _baseFontSize: number = 16, _viewportWidth: number = 1920, viewportHeight: number = 1080) => (value / 100) * viewportHeight,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    rem: (value: number, baseFontSize: number = 16, _viewportWidth: number = 1920, viewportHeight: number = 1080) => ((value / 100) * viewportHeight) / baseFontSize,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    em: (value: number, baseFontSize: number = 16, _viewportWidth: number = 1920, viewportHeight: number = 1080) => ((value / 100) * viewportHeight) / baseFontSize,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    vw: (value: number, _baseFontSize: number = 16, viewportWidth: number = 1920, viewportHeight: number = 1080) => (value / 100) * (viewportHeight / viewportWidth) * 100,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    pt: (value: number, _baseFontSize: number = 16, _viewportWidth: number = 1920, viewportHeight: number = 1080) => ((value / 100) * viewportHeight) * 0.75,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    in: (value: number, _baseFontSize: number = 16, _viewportWidth: number = 1920, viewportHeight: number = 1080) => ((value / 100) * viewportHeight) / 96,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    pc: (value: number, _baseFontSize: number = 16, _viewportWidth: number = 1920, viewportHeight: number = 1080) => ((value / 100) * viewportHeight) / 16,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cm: (value: number, _baseFontSize: number = 16, _viewportWidth: number = 1920, viewportHeight: number = 1080) => ((value / 100) * viewportHeight) / 37.795275591,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mm: (value: number, _baseFontSize: number = 16, _viewportWidth: number = 1920, viewportHeight: number = 1080) => ((value / 100) * viewportHeight) / 3.7795275591,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    percent: (value: number, baseFontSize: number = 16, _viewportWidth: number = 1920, viewportHeight: number = 1080) => ((value / 100) * viewportHeight) / baseFontSize * 100
  },
  pt: {
    px: (value: number) => value / 0.75,
    rem: (value: number, baseFontSize: number = 16) => (value / 0.75) / baseFontSize,
    em: (value: number, baseFontSize: number = 16) => (value / 0.75) / baseFontSize,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    vw: (value: number, _baseFontSize: number = 16, viewportWidth: number = 1920) => ((value / 0.75) / viewportWidth) * 100,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    vh: (value: number, _baseFontSize: number = 16, _viewportWidth: number = 1920, viewportHeight: number = 1080) => ((value / 0.75) / viewportHeight) * 100,
    in: (value: number) => value / 72,
    pc: (value: number) => value / 12,
    cm: (value: number) => value / 28.346456693,
    mm: (value: number) => value / 2.8346456693,
    percent: (value: number, baseFontSize: number = 16) => ((value / 0.75) / baseFontSize) * 100
  },
  in: {
    px: (value: number) => value * 96,
    rem: (value: number, baseFontSize: number = 16) => (value * 96) / baseFontSize,
    em: (value: number, baseFontSize: number = 16) => (value * 96) / baseFontSize,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    vw: (value: number, _baseFontSize: number = 16, viewportWidth: number = 1920) => ((value * 96) / viewportWidth) * 100,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    vh: (value: number, _baseFontSize: number = 16, _viewportWidth: number = 1920, viewportHeight: number = 1080) => ((value * 96) / viewportHeight) * 100,
    pt: (value: number) => value * 72,
    pc: (value: number) => value * 6,
    cm: (value: number) => value * 2.54,
    mm: (value: number) => value * 25.4,
    percent: (value: number, baseFontSize: number = 16) => ((value * 96) / baseFontSize) * 100
  },
  pc: {
    px: (value: number) => value * 16,
    rem: (value: number, baseFontSize: number = 16) => (value * 16) / baseFontSize,
    em: (value: number, baseFontSize: number = 16) => (value * 16) / baseFontSize,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    vw: (value: number, _baseFontSize: number = 16, viewportWidth: number = 1920) => ((value * 16) / viewportWidth) * 100,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    vh: (value: number, _baseFontSize: number = 16, _viewportWidth: number = 1920, viewportHeight: number = 1080) => ((value * 16) / viewportHeight) * 100,
    pt: (value: number) => value * 12,
    in: (value: number) => value / 6,
    cm: (value: number) => value / 6 * 2.54,
    mm: (value: number) => value / 6 * 25.4,
    percent: (value: number, baseFontSize: number = 16) => ((value * 16) / baseFontSize) * 100
  },
  cm: {
    px: (value: number) => value * 37.795275591,
    rem: (value: number, baseFontSize: number = 16) => (value * 37.795275591) / baseFontSize,
    em: (value: number, baseFontSize: number = 16) => (value * 37.795275591) / baseFontSize,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    vw: (value: number, _baseFontSize: number = 16, viewportWidth: number = 1920) => ((value * 37.795275591) / viewportWidth) * 100,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    vh: (value: number, _baseFontSize: number = 16, _viewportWidth: number = 1920, viewportHeight: number = 1080) => ((value * 37.795275591) / viewportHeight) * 100,
    pt: (value: number) => value * 28.346456693,
    in: (value: number) => value / 2.54,
    pc: (value: number) => (value / 2.54) * 6,
    mm: (value: number) => value * 10,
    percent: (value: number, baseFontSize: number = 16) => ((value * 37.795275591) / baseFontSize) * 100
  },
  mm: {
    px: (value: number) => value * 3.7795275591,
    rem: (value: number, baseFontSize: number = 16) => (value * 3.7795275591) / baseFontSize,
    em: (value: number, baseFontSize: number = 16) => (value * 3.7795275591) / baseFontSize,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    vw: (value: number, _baseFontSize: number = 16, viewportWidth: number = 1920) => ((value * 3.7795275591) / viewportWidth) * 100,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    vh: (value: number, _baseFontSize: number = 16, _viewportWidth: number = 1920, viewportHeight: number = 1080) => ((value * 3.7795275591) / viewportHeight) * 100,
    pt: (value: number) => value * 2.8346456693,
    in: (value: number) => value / 25.4,
    pc: (value: number) => (value / 25.4) * 6,
    cm: (value: number) => value / 10,
    percent: (value: number, baseFontSize: number = 16) => ((value * 3.7795275591) / baseFontSize) * 100
  },
  percent: {
    px: (value: number, baseFontSize: number = 16) => (value / 100) * baseFontSize,
    rem: (value: number) => value / 100,
    em: (value: number) => value / 100,
    vw: (value: number, baseFontSize: number = 16, viewportWidth: number = 1920) => (value / 100) * (baseFontSize / viewportWidth) * 100,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    vh: (value: number, baseFontSize: number = 16, _viewportWidth: number = 1920, viewportHeight: number = 1080) => (value / 100) * (baseFontSize / viewportHeight) * 100,
    pt: (value: number, baseFontSize: number = 16) => (value / 100) * baseFontSize * 0.75,
    in: (value: number, baseFontSize: number = 16) => ((value / 100) * baseFontSize) / 96,
    pc: (value: number, baseFontSize: number = 16) => ((value / 100) * baseFontSize) / 16,
    cm: (value: number, baseFontSize: number = 16) => ((value / 100) * baseFontSize) / 37.795275591,
    mm: (value: number, baseFontSize: number = 16) => ((value / 100) * baseFontSize) / 3.7795275591
  }
};

const units: CSSUnit[] = ['px', 'rem', 'em', 'vw', 'vh', 'pt', 'in', 'pc', 'cm', 'mm', 'percent'];

// Unit descriptions for the modal
const unitDescriptions: Record<CSSUnit, string> = {
  px: 'Pixels - Absolute unit',
  rem: 'Root em - Relative to root font size',
  em: 'Em - Relative to parent font size',
  vw: 'Viewport width - Relative to viewport width',
  vh: 'Viewport height - Relative to viewport height',
  pt: 'Points - Print unit',
  in: 'Inches - Print unit',
  pc: 'Picas - Print unit',
  cm: 'Centimeters - Print unit',
  mm: 'Millimeters - Print unit',
  percent: 'Percentage - Relative to parent'
};

export default function CssUnitsConverter() {
  const [fromValue, setFromValue] = useState<string>('');
  const [toValue, setToValue] = useState<string>('');
  const [fromUnit, setFromUnit] = useState<CSSUnit>('px');
  const [toUnit, setToUnit] = useState<CSSUnit>('rem');
  const [textSize, setTextSize] = useState<string>('8vw');
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [baseFontSize, setBaseFontSize] = useState<number>(16);
  const [viewportWidth, setViewportWidth] = useState<number>(1920);
  const [viewportHeight, setViewportHeight] = useState<number>(1080);
  const [copyFeedback, setCopyFeedback] = useState<{ from: boolean; to: boolean }>({ from: false, to: false });
  const [showModal, setShowModal] = useState<boolean>(false);
  const [activeField, setActiveField] = useState<'from' | 'to' | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
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

  const convert = (value: number, from: CSSUnit, to: CSSUnit): number => {
    if (from === to) return value;
    
    const conversion = conversionFactors[from]?.[to];
    if (conversion) {
      return conversion(value, baseFontSize, viewportWidth, viewportHeight);
    }
    
    return value;
  };

  const handleFromChange = (value: number | '') => {
    if (value === '') {
      setFromValue('');
      setToValue('');
      return;
    }
    setFromValue(value.toString());
    const convertedValue = convert(value, fromUnit, toUnit);
    setToValue(formatNumber(convertedValue));
  };

  const handleToChange = (value: number | '') => {
    if (value === '') {
      setToValue('');
      setFromValue('');
      return;
    }
    setToValue(value.toString());
    const convertedValue = convert(value, toUnit, fromUnit);
    setFromValue(formatNumber(convertedValue));
  };

  const handleUnitChange = (newUnit: CSSUnit) => {
    if (activeField === 'from') {
      setFromUnit(newUnit);
      if (fromValue && fromValue !== '') {
        const value = parseFloat(fromValue);
        const convertedValue = convert(value, newUnit, toUnit);
        setToValue(formatNumber(convertedValue));
      }
    } else if (activeField === 'to') {
      setToUnit(newUnit);
      if (fromValue && fromValue !== '') {
        const value = parseFloat(fromValue);
        const convertedValue = convert(value, fromUnit, newUnit);
        setToValue(formatNumber(convertedValue));
      }
    }
    setShowModal(false);
    setActiveField(null);
  };

  const openUnitModal = (field: 'from' | 'to') => {
    setActiveField(field);
    setShowModal(true);
  };

  const copyToClipboard = async (text: string, field: 'from' | 'to') => {
    if (!text) return;
    
    try {
      const unit = field === 'from' ? fromUnit : toUnit;
      const unitSuffix = unit === 'percent' ? '%' : unit;
      const valueWithUnit = `${text}${unitSuffix}`;
      
      await navigator.clipboard.writeText(valueWithUnit);
      setCopyFeedback(prev => ({ ...prev, [field]: true }));
      setTimeout(() => {
        setCopyFeedback(prev => ({ ...prev, [field]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full mb-0 flex-1">
      {/* Settings Panel */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full p-4 bg-gray-900/50 border-b border-gray-800"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Base Font Size (px)</label>
            <input
              type="number"
              value={baseFontSize}
              onChange={(e) => setBaseFontSize(Number(e.target.value))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
              max="100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Viewport Width (px)</label>
            <input
              type="number"
              value={viewportWidth}
              onChange={(e) => setViewportWidth(Number(e.target.value))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="100"
              max="10000"
            />
          </div>
        </div>
      </motion.div>

      {/* Converter */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-center justify-between w-full h-full"
      >
        {/* From Unit Input */}
        <div className="relative w-full md:w-1/2 h-1/2 md:h-full flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-800">
          <motion.div 
            className="w-full h-full flex flex-col items-center justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >

            {/* Input Field with Copy Button */}
            <div className="relative h-full flex-1 w-full flex items-center justify-center">
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
                className="w-full h-full font-bold text-center bg-transparent border-none focus:ring-0 focus:outline-none text-white placeholder-gray-600 overflow-hidden pr-12"
                style={{ fontSize: textSize }}
                decimalScale={8}
                allowNegative={false}
                allowLeadingZeros={false}
                valueIsNumericString={false}
              />
            </div>

            {/* Unit Display with Copy Button */}
            <div className="border-t border-gray-800 w-full text-center p-3 flex items-center justify-center gap-4">
              <motion.button
                onClick={() => openUnitModal('from')}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm hover:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{fromUnit === 'percent' ? '%' : fromUnit}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.button>
              {/* Copy Button */}
              <motion.button
                onClick={() => copyToClipboard(fromValue, 'from')}
                className="text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                disabled={!fromValue}
              >
                {copyFeedback.from ? (
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </motion.button>
            </div>

          </motion.div>
        </div>

        {/* To Unit Input */}
        <div className="relative w-full md:w-1/2 h-1/2 md:h-full flex flex-col items-center justify-center">
          <motion.div 
            className="w-full h-full flex flex-col items-center justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {/* Input Field with Copy Button */}
            <div className="relative h-full flex-1 w-full flex items-center justify-center">
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
                className="w-full h-full font-bold text-center bg-transparent border-none focus:ring-0 focus:outline-none text-white placeholder-gray-600 overflow-hidden pr-12"
                style={{ fontSize: textSize }}
                decimalScale={8}
                allowNegative={false}
                allowLeadingZeros={false}
                valueIsNumericString={false}
              />
            </div>

            {/* Unit Display with Copy Button */}
            <div className="border-t border-gray-800 w-full text-center p-3 flex items-center justify-center gap-4">
              <motion.button
                onClick={() => openUnitModal('to')}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm hover:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{toUnit === 'percent' ? '%' : toUnit}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.button>
              {/* Copy Button */}
              <motion.button
                onClick={() => copyToClipboard(toValue, 'to')}
                className="text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                disabled={!toValue}
              >
                {copyFeedback.to ? (
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Unit Selection Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowModal(false);
              setActiveField(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Select Unit
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setActiveField(null);
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {units.map((unit) => {
                  const currentUnit = activeField === 'from' ? fromUnit : toUnit;
                  const isSelected = unit === currentUnit;
                  
                  return (
                    <motion.button
                      key={unit}
                      onClick={() => handleUnitChange(unit)}
                      className={`p-3 rounded-lg border transition-colors text-left ${
                        isSelected
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700 hover:border-gray-600'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="font-semibold text-sm">
                        {unit === 'percent' ? '%' : unit}
                      </div>
                      <div className="text-xs opacity-75 mt-1">
                        {unitDescriptions[unit]}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
