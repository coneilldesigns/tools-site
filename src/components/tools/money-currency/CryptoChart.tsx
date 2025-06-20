'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type Crypto = 'BTC' | 'ETH' | 'USDT' | 'BNB' | 'SOL' | 'ADA' | 'XRP' | 'DOT' | 'DOGE' | 'AVAX' | 'MATIC' | 'LINK' | 'UNI' | 'LTC' | 'BCH' | 'XLM' | 'ATOM' | 'ETC' | 'FIL' | 'TRX' | 'NEAR' | 'ALGO' | 'VET' | 'ICP' | 'FTM' | 'MANA' | 'SAND' | 'AXS' | 'GALA' | 'CHZ';

type Timeframe = '1d' | '7d' | '30d' | '90d' | '1y';

interface ChartDataPoint {
  timestamp: number;
  price: number;
}

interface CryptoData {
  [key: string]: ChartDataPoint[];
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

const timeframes: { value: Timeframe; label: string }[] = [
  { value: '1d', label: '24H' },
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' },
  { value: '90d', label: '90D' },
  { value: '1y', label: '1Y' },
];

export default function CryptoChart() {
  const [selectedCryptos, setSelectedCryptos] = useState<Crypto[]>(['BTC', 'ETH']);
  const [timeframe, setTimeframe] = useState<Timeframe>('1y');
  const [chartData, setChartData] = useState<CryptoData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const [currentPrice, setCurrentPrice] = useState<Record<string, number>>({});
  const [priceChange, setPriceChange] = useState<Record<string, { change: number; percent: number }>>({});
  const [isPreloading, setIsPreloading] = useState(true);
  const [preloadProgress, setPreloadProgress] = useState(0);

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

  // Preload data for all timeframes
  const preloadData = useCallback(async () => {
    if (selectedCryptos.length === 0) return;

    setIsPreloading(true);
    setPreloadProgress(0);
    setError('');

    try {
      const totalRequests = selectedCryptos.length * timeframes.length;
      let completedRequests = 0;

      // Fetch data for all timeframes for selected cryptos
      for (const tf of timeframes) {
        const days = tf.value === '1d' ? 1 : tf.value === '7d' ? 7 : tf.value === '30d' ? 30 : tf.value === '90d' ? 90 : 365;

        for (const crypto of selectedCryptos) {
          try {
            const id = cryptoToId(crypto);
            const response = await fetch(
              `/api/crypto/chart?coinId=${id}&days=${days}`
            );

            if (response.ok) {
              const data = await response.json();
              // Store in chartData for immediate use
              setChartData(prev => ({
                ...prev,
                [`${crypto}_${tf.value}`]: data.prices.map(([timestamp, price]: [number, number]) => ({
                  timestamp,
                  price
                }))
              }));
            }

            completedRequests++;
            setPreloadProgress((completedRequests / totalRequests) * 100);

            // Small delay to avoid overwhelming the API
            await new Promise(resolve => setTimeout(resolve, 100));
          } catch (err) {
            console.warn(`Failed to preload ${crypto} ${tf.value}:`, err);
            completedRequests++;
            setPreloadProgress((completedRequests / totalRequests) * 100);
          }
        }
      }
    } catch (err) {
      console.error('Error during preload:', err);
      setError('Failed to preload some data. You can still use the chart.');
    } finally {
      setIsPreloading(false);
    }
  }, [selectedCryptos]);

  // Fetch chart data for current timeframe
  const fetchChartData = useCallback(async () => {
    if (selectedCryptos.length === 0) return;

    setIsLoading(true);
    setError('');

    try {
      const days = timeframe === '1d' ? 1 : timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : timeframe === '90d' ? 90 : 365;
      
      const promises = selectedCryptos.map(async (crypto) => {
        const id = cryptoToId(crypto);
        
        const response = await fetch(
          `/api/crypto/chart?coinId=${id}&days=${days}`
        );
        
        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 429) {
            throw new Error(`Rate limit exceeded. Please try again in ${errorData.retryAfter || 60} seconds.`);
          }
          throw new Error(`Failed to fetch data for ${crypto}: ${errorData.error || 'Unknown error'}`);
        }
        
        const data = await response.json();
        return {
          crypto,
          prices: data.prices.map(([timestamp, price]: [number, number]) => ({
            timestamp,
            price
          }))
        };
      });

      const results = await Promise.all(promises);
      const newChartData: CryptoData = {};
      const newCurrentPrice: Record<string, number> = {};
      const newPriceChange: Record<string, { change: number; percent: number }> = {};

      results.forEach(({ crypto, prices }) => {
        newChartData[crypto] = prices;
        if (prices.length > 0) {
          newCurrentPrice[crypto] = prices[prices.length - 1].price;
          
          if (prices.length > 1) {
            const current = prices[prices.length - 1].price;
            const previous = prices[0].price;
            const change = current - previous;
            const percent = (change / previous) * 100;
            newPriceChange[crypto] = { change, percent };
          }
        }
      });

      setChartData(newChartData);
      setCurrentPrice(newCurrentPrice);
      setPriceChange(newPriceChange);
    } catch (err) {
      console.error('Error fetching chart data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch chart data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCryptos, timeframe]);

  useEffect(() => {
    preloadData();
  }, [preloadData]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  // Prepare chart data for Chart.js
  const prepareChartData = () => {
    const datasets = selectedCryptos.map((crypto, index) => {
      const data = chartData[crypto] || [];
      const colors = [
        '#3B82F6', // blue
        '#10B981', // green
        '#F59E0B', // yellow
        '#EF4444', // red
        '#8B5CF6', // purple
        '#06B6D4', // cyan
        '#F97316', // orange
        '#EC4899', // pink
        '#84CC16', // lime
        '#6366F1', // indigo
      ];

      return {
        label: `${crypto} (${cryptoNames[crypto]})`,
        data: data.map(point => point.price),
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length] + '20',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: colors[index % colors.length],
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
      };
    });

    const labels = chartData[selectedCryptos[0]]?.map(point => 
      new Date(point.timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        ...(timeframe === '1d' && { hour: 'numeric' })
      })
    ) || [];

    return {
      labels,
      datasets,
    };
  };

  // Chart options
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: '#9CA3AF',
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#F9FAFB',
        bodyColor: '#D1D5DB',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: '#374151',
        },
        ticks: {
          color: '#9CA3AF',
          maxTicksLimit: 8,
        },
      },
      y: {
        display: true,
        grid: {
          color: '#374151',
        },
        ticks: {
          color: '#9CA3AF',
          callback: function(value) {
            return '$' + Number(value).toLocaleString();
          },
        },
      },
    },
  };

  const handleCryptoToggle = (crypto: Crypto) => {
    setSelectedCryptos(prev => 
      prev.includes(crypto) 
        ? prev.filter(c => c !== crypto)
        : [...prev, crypto]
    );
  };

  const handleCryptoAdd = (crypto: Crypto) => {
    if (!selectedCryptos.includes(crypto)) {
      setSelectedCryptos(prev => [...prev, crypto]);
    }
    setShowCryptoModal(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {/* Header Controls */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full p-4 bg-gray-900/50 border-b border-gray-800"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-white">Crypto Price Charts</h2>
            <motion.button
              onClick={() => setShowCryptoModal(true)}
              className="px-3 py-2 bg-blue-600 border border-blue-500 rounded-md text-white text-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Crypto
            </motion.button>
          </div>
          
          <div className="flex items-center gap-2">
            {timeframes.map((tf) => (
              <motion.button
                key={tf.value}
                onClick={() => setTimeframe(tf.value)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  timeframe === tf.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tf.label}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Selected Cryptos Display */}
      {selectedCryptos.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full p-4 bg-gray-900/30 border-b border-gray-800"
        >
          <div className="flex flex-wrap items-center gap-3">
            {selectedCryptos.map((crypto) => (
              <motion.div
                key={crypto}
                className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md"
                whileHover={{ scale: 1.02 }}
              >
                <span className="text-lg">{cryptoIcons[crypto]}</span>
                <span className="text-white font-medium">{crypto}</span>
                {currentPrice[crypto] && (
                  <span className="text-green-400 font-semibold">
                    ${currentPrice[crypto].toLocaleString()}
                  </span>
                )}
                {priceChange[crypto] && (
                  <span className={`text-sm font-medium ${
                    priceChange[crypto].percent >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {priceChange[crypto].percent >= 0 ? '+' : ''}{priceChange[crypto].percent.toFixed(2)}%
                  </span>
                )}
                <button
                  onClick={() => handleCryptoToggle(crypto)}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Chart Container */}
      <div className="flex-1 w-full p-4">
        {isPreloading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <div className="text-gray-400">Preloading chart data...</div>
              <div className="w-64 bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${preloadProgress}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-500">{Math.round(preloadProgress)}% complete</div>
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <div className="text-gray-400">Loading chart data...</div>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-red-400 mb-4 max-w-md">{error}</div>
              <div className="flex gap-2 justify-center">
                <motion.button
                  onClick={fetchChartData}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Retry
                </motion.button>
                <motion.button
                  onClick={preloadData}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Preload All Data
                </motion.button>
              </div>
            </div>
          </div>
        ) : selectedCryptos.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <div className="text-6xl mb-4">📊</div>
              <div className="text-xl mb-2">No cryptocurrencies selected</div>
              <div className="text-sm">Click &quot;Add Crypto&quot; to start viewing charts</div>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full min-h-[400px]"
          >
            <Line data={prepareChartData()} options={chartOptions} />
          </motion.div>
        )}
      </div>

      {/* Crypto Selection Modal */}
      <AnimatePresence>
        {showCryptoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCryptoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Select Cryptocurrencies
                </h3>
                <button
                  onClick={() => setShowCryptoModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {cryptos.map((crypto) => {
                  const isSelected = selectedCryptos.includes(crypto);
                  
                  return (
                    <motion.button
                      key={crypto}
                      onClick={() => handleCryptoAdd(crypto)}
                      className={`p-3 rounded-lg border transition-colors text-left ${
                        isSelected
                          ? 'bg-blue-600 border-blue-500 text-white cursor-not-allowed'
                          : 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700 hover:border-gray-600'
                      }`}
                      whileHover={!isSelected ? { scale: 1.02 } : {}}
                      whileTap={!isSelected ? { scale: 0.98 } : {}}
                      disabled={isSelected}
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
