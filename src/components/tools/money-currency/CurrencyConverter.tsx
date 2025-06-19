'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NumericFormat } from 'react-number-format';

type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | 'CHF' | 'CNY' | 'INR' | 'BRL' | 'MXN' | 'KRW' | 'SGD' | 'NZD' | 'SEK' | 'NOK' | 'DKK' | 'PLN' | 'CZK' | 'HUF' | 'RUB' | 'TRY' | 'ZAR' | 'THB' | 'MYR' | 'IDR' | 'PHP' | 'VND' | 'EGP' | 'NGN';

interface ApiResponse {
  result: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  base_code: string;
  target_code: string;
  conversion_rate: number;
}

const currencies: Currency[] = [
  'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL',
  'MXN', 'KRW', 'SGD', 'NZD', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF',
  'RUB', 'TRY', 'ZAR', 'THB', 'MYR', 'IDR', 'PHP', 'VND', 'EGP', 'NGN'
];

const currencyNames: Record<Currency, string> = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  JPY: 'Japanese Yen',
  CAD: 'Canadian Dollar',
  AUD: 'Australian Dollar',
  CHF: 'Swiss Franc',
  CNY: 'Chinese Yuan',
  INR: 'Indian Rupee',
  BRL: 'Brazilian Real',
  MXN: 'Mexican Peso',
  KRW: 'South Korean Won',
  SGD: 'Singapore Dollar',
  NZD: 'New Zealand Dollar',
  SEK: 'Swedish Krona',
  NOK: 'Norwegian Krone',
  DKK: 'Danish Krone',
  PLN: 'Polish Złoty',
  CZK: 'Czech Koruna',
  HUF: 'Hungarian Forint',
  RUB: 'Russian Ruble',
  TRY: 'Turkish Lira',
  ZAR: 'South African Rand',
  THB: 'Thai Baht',
  MYR: 'Malaysian Ringgit',
  IDR: 'Indonesian Rupiah',
  PHP: 'Philippine Peso',
  VND: 'Vietnamese Dong',
  EGP: 'Egyptian Pound',
  NGN: 'Nigerian Naira'
};

// Currency symbol positions and symbols
const currencySymbols: Record<Currency, { symbol: string; position: 'before' | 'after' }> = {
  USD: { symbol: '$', position: 'before' },
  EUR: { symbol: '€', position: 'before' },
  GBP: { symbol: '£', position: 'before' },
  JPY: { symbol: '¥', position: 'before' },
  CAD: { symbol: 'C$', position: 'before' },
  AUD: { symbol: 'A$', position: 'before' },
  CHF: { symbol: 'CHF', position: 'before' },
  CNY: { symbol: '¥', position: 'before' },
  INR: { symbol: '₹', position: 'before' },
  BRL: { symbol: 'R$', position: 'before' },
  MXN: { symbol: '$', position: 'before' },
  KRW: { symbol: '₩', position: 'before' },
  SGD: { symbol: 'S$', position: 'before' },
  NZD: { symbol: 'NZ$', position: 'before' },
  SEK: { symbol: 'kr', position: 'after' },
  NOK: { symbol: 'kr', position: 'after' },
  DKK: { symbol: 'kr', position: 'after' },
  PLN: { symbol: 'zł', position: 'after' },
  CZK: { symbol: 'Kč', position: 'after' },
  HUF: { symbol: 'Ft', position: 'after' },
  RUB: { symbol: '₽', position: 'after' },
  TRY: { symbol: '₺', position: 'after' },
  ZAR: { symbol: 'R', position: 'before' },
  THB: { symbol: '฿', position: 'before' },
  MYR: { symbol: 'RM', position: 'before' },
  IDR: { symbol: 'Rp', position: 'before' },
  PHP: { symbol: '₱', position: 'before' },
  VND: { symbol: '₫', position: 'after' },
  EGP: { symbol: 'E£', position: 'before' },
  NGN: { symbol: '₦', position: 'before' }
};

// Country flags for currencies
const currencyFlags: Record<Currency, string> = {
  USD: '🇺🇸',
  EUR: '🇪🇺',
  GBP: '🇬🇧',
  JPY: '🇯🇵',
  CAD: '🇨🇦',
  AUD: '🇦🇺',
  CHF: '🇨🇭',
  CNY: '🇨🇳',
  INR: '🇮🇳',
  BRL: '🇧🇷',
  MXN: '🇲🇽',
  KRW: '🇰🇷',
  SGD: '🇸🇬',
  NZD: '🇳🇿',
  SEK: '🇸🇪',
  NOK: '🇳🇴',
  DKK: '🇩🇰',
  PLN: '🇵🇱',
  CZK: '🇨🇿',
  HUF: '🇭🇺',
  RUB: '🇷🇺',
  TRY: '🇹🇷',
  ZAR: '🇿🇦',
  THB: '🇹🇭',
  MYR: '🇲🇾',
  IDR: '🇮🇩',
  PHP: '🇵🇭',
  VND: '🇻🇳',
  EGP: '🇪🇬',
  NGN: '🇳🇬'
};

export default function CurrencyConverter() {
  const [fromValue, setFromValue] = useState<string>('');
  const [toValue, setToValue] = useState<string>('');
  const [fromCurrency, setFromCurrency] = useState<Currency>('USD');
  const [toCurrency, setToCurrency] = useState<Currency>('EUR');
  const [showModal, setShowModal] = useState(false);
  const [activeField, setActiveField] = useState<'from' | 'to' | null>(null);
  const [copyFeedback, setCopyFeedback] = useState({ from: false, to: false });
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [error, setError] = useState<string>('');
  const lastUserInput = useRef<'from' | 'to' | null>(null);

  // Responsive text size
  const [textSize, setTextSize] = useState('8rem');

  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        setTextSize('4rem');
      } else if (window.innerWidth < 1024) {
        setTextSize('6rem');
      } else {
        setTextSize('8rem');
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch exchange rate
  const fetchExchangeRate = async (from: Currency, to: Currency) => {
    if (from === to) {
      setExchangeRate(1);
      setLastUpdated(new Date().toLocaleString());
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Using Exchange Rate API (free tier)
      const response = await fetch(`https://v6.exchangerate-api.com/v6/1093c44f82cf6a3873f56d19/pair/${from}/${to}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rate');
      }

      const data: ApiResponse = await response.json();
      
      if (data.result === 'success') {
        setExchangeRate(data.conversion_rate);
        setLastUpdated(new Date().toLocaleString());
      } else {
        throw new Error('Invalid response from API');
      }
    } catch (err) {
      console.error('Error fetching exchange rate:', err);
      setError('Failed to fetch exchange rate. Please try again later.');
      // Fallback to a basic conversion (this is just for demo purposes)
      // In a real app, you might want to use cached rates or a different API
      setExchangeRate(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeRate(fromCurrency, toCurrency);
  }, [fromCurrency, toCurrency]);

  const convert = (value: number, from: Currency, to: Currency): number => {
    if (from === to) return value;
    if (!exchangeRate) return 0;
    return value * exchangeRate;
  };

  const updateToValue = (value: number) => {
    lastUserInput.current = 'from';
    const converted = convert(value, fromCurrency, toCurrency);
    setToValue(converted.toFixed(2));
  };

  const updateFromValue = (value: number) => {
    lastUserInput.current = 'to';
    if (exchangeRate) {
      const converted = value / exchangeRate;
      setFromValue(converted.toFixed(2));
    }
  };

  const handleFromChange = (value: number | '') => {
    setFromValue(value === '' ? '' : value.toString());
    
    if (value !== '' && value !== null && !isNaN(value)) {
      updateToValue(value);
    } else {
      setToValue('');
    }
  };

  const handleToChange = (value: number | '') => {
    setToValue(value === '' ? '' : value.toString());
    
    if (value !== '' && value !== null && !isNaN(value) && exchangeRate) {
      updateFromValue(value);
    } else {
      setFromValue('');
    }
  };

  // Handle NumericFormat onValueChange with source tracking
  const handleFromValueChange = ({ floatValue }: { floatValue: number | undefined }) => {
    if (lastUserInput.current === 'to') {
      lastUserInput.current = null;
      return;
    }
    handleFromChange(floatValue ?? '');
  };

  const handleToValueChange = ({ floatValue }: { floatValue: number | undefined }) => {
    if (lastUserInput.current === 'from') {
      lastUserInput.current = null;
      return;
    }
    handleToChange(floatValue ?? '');
  };

  const handleCurrencyChange = (newCurrency: Currency) => {
    if (activeField === 'from') {
      setFromCurrency(newCurrency);
      // Recalculate the "to" value when "from" currency changes
      if (fromValue && exchangeRate) {
        const newToValue = parseFloat(fromValue) * exchangeRate;
        setToValue(newToValue.toFixed(2));
      }
    } else if (activeField === 'to') {
      setToCurrency(newCurrency);
      // Recalculate the "from" value when "to" currency changes
      if (toValue && exchangeRate) {
        const newFromValue = parseFloat(toValue) / exchangeRate;
        setFromValue(newFromValue.toFixed(2));
      }
    }
    setShowModal(false);
    setActiveField(null);
  };

  const openCurrencyModal = (field: 'from' | 'to') => {
    setActiveField(field);
    setShowModal(true);
  };

  const copyToClipboard = async (text: string, field: 'from' | 'to') => {
    if (!text) return;
    
    try {
      const currency = field === 'from' ? fromCurrency : toCurrency;
      const valueWithCurrency = `${text} ${currency}`;
      
      await navigator.clipboard.writeText(valueWithCurrency);
      setCopyFeedback(prev => ({ ...prev, [field]: true }));
      setTimeout(() => {
        setCopyFeedback(prev => ({ ...prev, [field]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromValue(toValue);
    setToValue(fromValue);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full mb-0 flex-1">
      {/* Exchange Rate Info */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full p-4 bg-gray-900/50 border-b border-gray-800"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">
              <span className="font-medium">Exchange Rate:</span>
              {isLoading ? (
                <span className="ml-2 text-blue-400">Loading...</span>
              ) : error ? (
                <span className="ml-2 text-red-400">{error}</span>
              ) : (
                <span className="ml-2 text-white">
                  1 {fromCurrency} = {exchangeRate?.toFixed(4)} {toCurrency}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <motion.button
              onClick={swapCurrencies}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm hover:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Swap
            </motion.button>
            {lastUpdated && (
              <div className="text-xs text-gray-500">
                Last updated: {lastUpdated}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Converter */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-center justify-between w-full h-full"
      >
        {/* From Currency Input */}
        <div className="relative w-full md:w-1/2 h-1/2 md:h-full flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-800">
          <motion.div 
            className="w-full h-full flex flex-col items-center justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {/* Input Field with Copy Button */}
            <div className="relative h-full flex-1 w-full flex items-center justify-center">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <div className="text-sm text-gray-400">Updating rates...</div>
                </div>
              ) : (
                <NumericFormat
                  value={fromValue}
                  onValueChange={handleFromValueChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' || e.key === 'Delete') {
                      e.preventDefault();
                      handleFromChange('');
                    }
                  }}
                  placeholder="0"
                  className="w-full h-full font-bold text-center bg-transparent border-none focus:ring-0 focus:outline-none text-white placeholder-gray-600 overflow-hidden pr-12"
                  style={{ fontSize: textSize }}
                  decimalScale={2}
                  allowNegative={false}
                  allowLeadingZeros={false}
                  valueIsNumericString={false}
                  prefix={currencySymbols[fromCurrency].position === 'before' ? currencySymbols[fromCurrency].symbol : ''}
                  suffix={currencySymbols[fromCurrency].position === 'after' ? currencySymbols[fromCurrency].symbol : ''}
                />
              )}
            </div>

            {/* Currency Display with Copy Button */}
            <div className="border-t border-gray-800 w-full text-center p-3 flex items-center justify-center gap-4">
              <motion.button
                onClick={() => openCurrencyModal('from')}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm hover:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg">{currencyFlags[fromCurrency]}</span>
                <span>{fromCurrency}</span>
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

        {/* To Currency Input */}
        <div className="relative w-full md:w-1/2 h-1/2 md:h-full flex flex-col items-center justify-center">
          <motion.div 
            className="w-full h-full flex flex-col items-center justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {/* Input Field with Copy Button */}
            <div className="relative h-full flex-1 w-full flex items-center justify-center">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <div className="text-sm text-gray-400">Updating rates...</div>
                </div>
              ) : (
                <NumericFormat
                  value={toValue}
                  onValueChange={handleToValueChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' || e.key === 'Delete') {
                      e.preventDefault();
                      handleToChange('');
                    }
                  }}
                  placeholder="0"
                  className="w-full h-full font-bold text-center bg-transparent border-none focus:ring-0 focus:outline-none text-white placeholder-gray-600 overflow-hidden pr-12"
                  style={{ fontSize: textSize }}
                  decimalScale={2}
                  allowNegative={false}
                  allowLeadingZeros={false}
                  valueIsNumericString={false}
                  prefix={currencySymbols[toCurrency].position === 'before' ? currencySymbols[toCurrency].symbol : ''}
                  suffix={currencySymbols[toCurrency].position === 'after' ? currencySymbols[toCurrency].symbol : ''}
                />
              )}
            </div>

            {/* Currency Display with Copy Button */}
            <div className="border-t border-gray-800 w-full text-center p-3 flex items-center justify-center gap-4">
              <motion.button
                onClick={() => openCurrencyModal('to')}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm hover:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg">{currencyFlags[toCurrency]}</span>
                <span>{toCurrency}</span>
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

      {/* Currency Selection Modal */}
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
              className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Select Currency
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
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {currencies.map((currency) => {
                  const currentCurrency = activeField === 'from' ? fromCurrency : toCurrency;
                  const isSelected = currency === currentCurrency;
                  
                  return (
                    <motion.button
                      key={currency}
                      onClick={() => handleCurrencyChange(currency)}
                      className={`p-3 rounded-lg border transition-colors text-left ${
                        isSelected
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700 hover:border-gray-600'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{currencyFlags[currency]}</span>
                        <div>
                          <div className="font-semibold text-sm">
                            {currency}
                          </div>
                          <div className="text-xs opacity-75 mt-1">
                            {currencyNames[currency]}
                          </div>
                        </div>
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
