'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NumericFormat } from 'react-number-format';

type Crypto = 'BTC' | 'ETH' | 'USDT' | 'BNB' | 'SOL' | 'ADA' | 'XRP' | 'DOT' | 'DOGE' | 'AVAX' | 'MATIC' | 'LINK' | 'UNI' | 'LTC' | 'BCH' | 'XLM' | 'ATOM' | 'ETC' | 'FIL' | 'TRX' | 'NEAR' | 'ALGO' | 'VET' | 'ICP' | 'FTM' | 'MANA' | 'SAND' | 'AXS' | 'GALA' | 'CHZ';

interface CryptoPrice {
  [key: string]: number;
}

interface ApiResponse {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
    last_updated_at: number;
  };
}

const cryptos: Crypto[] = [
  'BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'ADA', 'XRP', 'DOT', 'DOGE', 'AVAX',
  'MATIC', 'LINK', 'UNI', 'LTC', 'BCH', 'XLM', 'ATOM', 'ETC', 'FIL', 'TRX',
  'NEAR', 'ALGO', 'VET', 'ICP', 'FTM', 'MANA', 'SAND', 'AXS', 'GALA', 'CHZ'
];

const cryptoNames: Record<Crypto, string> = {
  BTC: 'Bitcoin',
  ETH: 'Ethereum',
  USDT: 'Tether',
  BNB: 'Binance Coin',
  SOL: 'Solana',
  ADA: 'Cardano',
  XRP: 'Ripple',
  DOT: 'Polkadot',
  DOGE: 'Dogecoin',
  AVAX: 'Avalanche',
  MATIC: 'Polygon',
  LINK: 'Chainlink',
  UNI: 'Uniswap',
  LTC: 'Litecoin',
  BCH: 'Bitcoin Cash',
  XLM: 'Stellar',
  ATOM: 'Cosmos',
  ETC: 'Ethereum Classic',
  FIL: 'Filecoin',
  TRX: 'TRON',
  NEAR: 'NEAR Protocol',
  ALGO: 'Algorand',
  VET: 'VeChain',
  ICP: 'Internet Computer',
  FTM: 'Fantom',
  MANA: 'Decentraland',
  SAND: 'The Sandbox',
  AXS: 'Axie Infinity',
  GALA: 'Gala',
  CHZ: 'Chiliz'
};

// Crypto symbols (most cryptos don't have traditional symbols, so we'll use the code)
const cryptoSymbols: Record<Crypto, { symbol: string; position: 'before' | 'after' }> = {
  BTC: { symbol: '₿', position: 'before' },
  ETH: { symbol: 'Ξ', position: 'before' },
  USDT: { symbol: '₮', position: 'before' },
  BNB: { symbol: 'BNB', position: 'before' },
  SOL: { symbol: '◎', position: 'before' },
  ADA: { symbol: '₳', position: 'before' },
  XRP: { symbol: 'XRP', position: 'before' },
  DOT: { symbol: 'DOT', position: 'before' },
  DOGE: { symbol: 'Ð', position: 'before' },
  AVAX: { symbol: 'AVAX', position: 'before' },
  MATIC: { symbol: 'MATIC', position: 'before' },
  LINK: { symbol: 'LINK', position: 'before' },
  UNI: { symbol: 'UNI', position: 'before' },
  LTC: { symbol: 'Ł', position: 'before' },
  BCH: { symbol: 'BCH', position: 'before' },
  XLM: { symbol: 'XLM', position: 'before' },
  ATOM: { symbol: 'ATOM', position: 'before' },
  ETC: { symbol: 'ETC', position: 'before' },
  FIL: { symbol: 'FIL', position: 'before' },
  TRX: { symbol: 'TRX', position: 'before' },
  NEAR: { symbol: 'NEAR', position: 'before' },
  ALGO: { symbol: 'ALGO', position: 'before' },
  VET: { symbol: 'VET', position: 'before' },
  ICP: { symbol: 'ICP', position: 'before' },
  FTM: { symbol: 'FTM', position: 'before' },
  MANA: { symbol: 'MANA', position: 'before' },
  SAND: { symbol: 'SAND', position: 'before' },
  AXS: { symbol: 'AXS', position: 'before' },
  GALA: { symbol: 'GALA', position: 'before' },
  CHZ: { symbol: 'CHZ', position: 'before' }
};

// Crypto icons/emojis
const cryptoIcons: Record<Crypto, string> = {
  BTC: '₿',
  ETH: 'Ξ',
  USDT: '💎',
  BNB: '🟡',
  SOL: '☀️',
  ADA: '🔷',
  XRP: '💎',
  DOT: '🔴',
  DOGE: '🐕',
  AVAX: '❄️',
  MATIC: '🟣',
  LINK: '🔗',
  UNI: '🦄',
  LTC: '⚡',
  BCH: '💰',
  XLM: '⭐',
  ATOM: '⚛️',
  ETC: '🔷',
  FIL: '📁',
  TRX: '🟢',
  NEAR: '🔵',
  ALGO: '🔵',
  VET: '🔴',
  ICP: '🌐',
  FTM: '👻',
  MANA: '🏰',
  SAND: '🏖️',
  AXS: '🎮',
  GALA: '🎮',
  CHZ: '⚽'
};

export default function CryptoConverter() {
  const [fromValue, setFromValue] = useState<string>('');
  const [toValue, setToValue] = useState<string>('');
  const [fromCrypto, setFromCrypto] = useState<Crypto>('BTC');
  const [toCrypto, setToCrypto] = useState<Crypto>('ETH');
  const [showModal, setShowModal] = useState(false);
  const [activeField, setActiveField] = useState<'from' | 'to' | null>(null);
  const [copyFeedback, setCopyFeedback] = useState({ from: false, to: false });
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice>({});
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [conversionTimeout, setConversionTimeout] = useState<NodeJS.Timeout | null>(null);
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

  // Fetch crypto prices
  const fetchCryptoPrices = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      // Using CoinGecko API (free, no API key required)
      const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptos.map(c => cryptoToId(c)).join(',')}&vs_currencies=usd&include_24hr_change=true&include_last_updated_at=true`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch crypto prices');
      }

      const data: ApiResponse = await response.json();
      
      // Convert to our format
      const prices: CryptoPrice = {};
      cryptos.forEach(crypto => {
        const id = cryptoToId(crypto);
        if (data[id]) {
          prices[crypto] = data[id].usd;
        }
      });
      
      setCryptoPrices(prices);
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      console.error('Error fetching crypto prices:', err);
      setError('Failed to fetch crypto prices. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Convert crypto code to CoinGecko ID
  const cryptoToId = (crypto: Crypto): string => {
    const idMap: Record<Crypto, string> = {
      BTC: 'bitcoin',
      ETH: 'ethereum',
      USDT: 'tether',
      BNB: 'binancecoin',
      SOL: 'solana',
      ADA: 'cardano',
      XRP: 'ripple',
      DOT: 'polkadot',
      DOGE: 'dogecoin',
      AVAX: 'avalanche-2',
      MATIC: 'matic-network',
      LINK: 'chainlink',
      UNI: 'uniswap',
      LTC: 'litecoin',
      BCH: 'bitcoin-cash',
      XLM: 'stellar',
      ATOM: 'cosmos',
      ETC: 'ethereum-classic',
      FIL: 'filecoin',
      TRX: 'tron',
      NEAR: 'near',
      ALGO: 'algorand',
      VET: 'vechain',
      ICP: 'internet-computer',
      FTM: 'fantom',
      MANA: 'decentraland',
      SAND: 'the-sandbox',
      AXS: 'axie-infinity',
      GALA: 'gala',
      CHZ: 'chiliz'
    };
    return idMap[crypto];
  };

  useEffect(() => {
    fetchCryptoPrices();
    // Refresh prices every 30 seconds
    const interval = setInterval(fetchCryptoPrices, 30000);
    return () => clearInterval(interval);
  }, [fetchCryptoPrices]);

  const convert = (value: number, from: Crypto, to: Crypto): number => {
    if (from === to) return value;
    if (!cryptoPrices[from] || !cryptoPrices[to]) return 0;
    
    // Convert through USD
    const usdValue = value * cryptoPrices[from];
    return usdValue / cryptoPrices[to];
  };

  const updateToValue = (value: number) => {
    lastUserInput.current = 'from';
    const converted = convert(value, fromCrypto, toCrypto);
    setToValue(converted.toFixed(6));
  };

  const updateFromValue = (value: number) => {
    lastUserInput.current = 'to';
    const converted = value / (cryptoPrices[toCrypto] / cryptoPrices[fromCrypto]);
    setFromValue(converted.toFixed(6));
  };

  const handleFromChange = (value: number | '') => {
    setFromValue(value === '' ? '' : value.toString());
    
    // Clear any existing timeout
    if (conversionTimeout) {
      clearTimeout(conversionTimeout);
    }
    
    // Set a new timeout for conversion
    if (value !== '' && value !== null && !isNaN(value)) {
      const timeout = setTimeout(() => {
        if (cryptoPrices[fromCrypto] && cryptoPrices[toCrypto]) {
          updateToValue(value);
        }
      }, 500); // 500ms delay
      setConversionTimeout(timeout);
    } else if (value === '') {
      setToValue('');
    }
  };

  const handleToChange = (value: number | '') => {
    setToValue(value === '' ? '' : value.toString());
    
    // Clear any existing timeout
    if (conversionTimeout) {
      clearTimeout(conversionTimeout);
    }
    
    // Set a new timeout for conversion
    if (value !== '' && value !== null && !isNaN(value)) {
      const timeout = setTimeout(() => {
        if (cryptoPrices[fromCrypto] && cryptoPrices[toCrypto]) {
          updateFromValue(value);
        }
      }, 500); // 500ms delay
      setConversionTimeout(timeout);
    } else if (value === '') {
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

  const handleCryptoChange = (newCrypto: Crypto) => {
    if (activeField === 'from') {
      setFromCrypto(newCrypto);
      // Recalculate the "to" value when "from" crypto changes
      if (fromValue && cryptoPrices[newCrypto] && cryptoPrices[toCrypto]) {
        const newToValue = parseFloat(fromValue) * (cryptoPrices[newCrypto] / cryptoPrices[toCrypto]);
        setToValue(newToValue.toFixed(6));
      }
    } else if (activeField === 'to') {
      setToCrypto(newCrypto);
      // Recalculate the "from" value when "to" crypto changes
      if (toValue && cryptoPrices[fromCrypto] && cryptoPrices[newCrypto]) {
        const newFromValue = parseFloat(toValue) / (cryptoPrices[newCrypto] / cryptoPrices[fromCrypto]);
        setFromValue(newFromValue.toFixed(6));
      }
    }
    setShowModal(false);
    setActiveField(null);
  };

  const openCryptoModal = (field: 'from' | 'to') => {
    setActiveField(field);
    setShowModal(true);
  };

  const copyToClipboard = async (text: string, field: 'from' | 'to') => {
    if (!text) return;
    
    try {
      const crypto = field === 'from' ? fromCrypto : toCrypto;
      const valueWithCrypto = `${text} ${crypto}`;
      
      await navigator.clipboard.writeText(valueWithCrypto);
      setCopyFeedback(prev => ({ ...prev, [field]: true }));
      setTimeout(() => {
        setCopyFeedback(prev => ({ ...prev, [field]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const swapCryptos = () => {
    setFromCrypto(toCrypto);
    setToCrypto(fromCrypto);
    setFromValue(toValue);
    setToValue(fromValue);
  };

  const getExchangeRate = () => {
    if (!cryptoPrices[fromCrypto] || !cryptoPrices[toCrypto]) return null;
    return cryptoPrices[fromCrypto] / cryptoPrices[toCrypto];
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
                  1 {fromCrypto} = {getExchangeRate()?.toFixed(6)} {toCrypto}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <motion.button
              onClick={swapCryptos}
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
        {/* From Crypto Input */}
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
                  <div className="text-sm text-gray-400">Updating prices...</div>
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
                  decimalScale={6}
                  allowNegative={false}
                  allowLeadingZeros={false}
                  valueIsNumericString={false}
                  prefix={cryptoSymbols[fromCrypto].position === 'before' ? cryptoSymbols[fromCrypto].symbol : ''}
                  suffix={cryptoSymbols[fromCrypto].position === 'after' ? cryptoSymbols[fromCrypto].symbol : ''}
                />
              )}
            </div>

            {/* Crypto Display with Copy Button */}
            <div className="border-t border-gray-800 w-full text-center p-3 flex items-center justify-center gap-4">
              <motion.button
                onClick={() => openCryptoModal('from')}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm hover:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg">{cryptoIcons[fromCrypto]}</span>
                <span>{fromCrypto}</span>
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

        {/* To Crypto Input */}
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
                  <div className="text-sm text-gray-400">Updating prices...</div>
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
                  decimalScale={6}
                  allowNegative={false}
                  allowLeadingZeros={false}
                  valueIsNumericString={false}
                  prefix={cryptoSymbols[toCrypto].position === 'before' ? cryptoSymbols[toCrypto].symbol : ''}
                  suffix={cryptoSymbols[toCrypto].position === 'after' ? cryptoSymbols[toCrypto].symbol : ''}
                />
              )}
            </div>

            {/* Crypto Display with Copy Button */}
            <div className="border-t border-gray-800 w-full text-center p-3 flex items-center justify-center gap-4">
              <motion.button
                onClick={() => openCryptoModal('to')}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm hover:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg">{cryptoIcons[toCrypto]}</span>
                <span>{toCrypto}</span>
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

      {/* Crypto Selection Modal */}
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
                  Select Cryptocurrency
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
                {cryptos.map((crypto) => {
                  const currentCrypto = activeField === 'from' ? fromCrypto : toCrypto;
                  const isSelected = crypto === currentCrypto;
                  
                  return (
                    <motion.button
                      key={crypto}
                      onClick={() => handleCryptoChange(crypto)}
                      className={`p-3 rounded-lg border transition-colors text-left ${
                        isSelected
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700 hover:border-gray-600'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{cryptoIcons[crypto]}</span>
                        <div>
                          <div className="font-semibold text-sm">
                            {crypto}
                          </div>
                          <div className="text-xs opacity-75 mt-1">
                            {cryptoNames[crypto]}
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
