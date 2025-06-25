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
  TimeScale,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale
);

type Stock = 'AAPL' | 'MSFT' | 'GOOGL' | 'AMZN' | 'TSLA' | 'META' | 'NVDA' | 'NFLX' | 'AMD' | 'INTC' | 'CRM' | 'ORCL' | 'ADBE' | 'PYPL' | 'UBER' | 'SPOT' | 'ZM' | 'SHOP' | 'SQ' | 'ROKU' | 'SNAP' | 'TWTR' | 'LYFT' | 'PINS' | 'BYND' | 'PLTR' | 'COIN' | 'HOOD' | 'RBLX' | 'PATH';

type Timeframe = '1d' | '5d' | '1m' | '3m' | '6m' | '1y' | '2y' | '5y';

interface ChartDataPoint {
  timestamp: number;
  price: number;
  volume?: number;
}

interface StockData {
  [key: string]: ChartDataPoint[];
}

const stocks: Stock[] = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX', 'AMD', 'INTC',
  'CRM', 'ORCL', 'ADBE', 'PYPL', 'UBER', 'SPOT', 'ZM', 'SHOP', 'SQ', 'ROKU',
  'SNAP', 'TWTR', 'LYFT', 'PINS', 'BYND', 'PLTR', 'COIN', 'HOOD', 'RBLX', 'PATH'
];

const stockNames: Record<Stock, string> = {
  AAPL: 'Apple Inc.',
  MSFT: 'Microsoft Corporation',
  GOOGL: 'Alphabet Inc.',
  AMZN: 'Amazon.com Inc.',
  TSLA: 'Tesla Inc.',
  META: 'Meta Platforms Inc.',
  NVDA: 'NVIDIA Corporation',
  NFLX: 'Netflix Inc.',
  AMD: 'Advanced Micro Devices',
  INTC: 'Intel Corporation',
  CRM: 'Salesforce Inc.',
  ORCL: 'Oracle Corporation',
  ADBE: 'Adobe Inc.',
  PYPL: 'PayPal Holdings Inc.',
  UBER: 'Uber Technologies Inc.',
  SPOT: 'Spotify Technology S.A.',
  ZM: 'Zoom Video Communications',
  SHOP: 'Shopify Inc.',
  SQ: 'Block Inc.',
  ROKU: 'Roku Inc.',
  SNAP: 'Snap Inc.',
  TWTR: 'Twitter Inc.',
  LYFT: 'Lyft Inc.',
  PINS: 'Pinterest Inc.',
  BYND: 'Beyond Meat Inc.',
  PLTR: 'Palantir Technologies',
  COIN: 'Coinbase Global Inc.',
  HOOD: 'Robinhood Markets Inc.',
  RBLX: 'Roblox Corporation',
  PATH: 'UiPath Inc.'
};

const stockIcons: Record<Stock, string> = {
  AAPL: '🍎',
  MSFT: '🪟',
  GOOGL: '🔍',
  AMZN: '📦',
  TSLA: '⚡',
  META: '📘',
  NVDA: '🎮',
  NFLX: '📺',
  AMD: '🔴',
  INTC: '🔵',
  CRM: '☁️',
  ORCL: '🗄️',
  ADBE: '🎨',
  PYPL: '💳',
  UBER: '🚗',
  SPOT: '🎵',
  ZM: '📹',
  SHOP: '🛒',
  SQ: '💳',
  ROKU: '📺',
  SNAP: '👻',
  TWTR: '🐦',
  LYFT: '🚗',
  PINS: '📌',
  BYND: '🥩',
  PLTR: '🔮',
  COIN: '🪙',
  HOOD: '🎯',
  RBLX: '🎮',
  PATH: '🤖'
};

const timeframes: { value: Timeframe; label: string }[] = [
  { value: '1d', label: '1D' },
  { value: '5d', label: '5D' },
  { value: '1m', label: '1M' },
  { value: '3m', label: '3M' },
  { value: '6m', label: '6M' },
  { value: '1y', label: '1Y' },
  { value: '2y', label: '2Y' },
  { value: '5y', label: '5Y' },
];

export default function StockChart() {
  const [selectedStocks, setSelectedStocks] = useState<Stock[]>(['AAPL', 'MSFT']);
  const [timeframe, setTimeframe] = useState<Timeframe>('1y');
  const [chartData, setChartData] = useState<StockData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showStockModal, setShowStockModal] = useState(false);
  const [currentPrice, setCurrentPrice] = useState<Record<string, number>>({});
  const [priceChange, setPriceChange] = useState<Record<string, { change: number; percent: number }>>({});
  const [isPreloading, setIsPreloading] = useState(true);
  const [preloadProgress, setPreloadProgress] = useState(0);

  // Fetch stock data from Alpha Vantage API
  const fetchStockData = useCallback(async (symbol: Stock, timeframe: Timeframe) => {
    try {
      const response = await fetch(`/api/stocks/chart?symbol=${symbol}&timeframe=${timeframe}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch stock data');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
      throw error;
    }
  }, []);

  // Fetch current stock quote
  const fetchStockQuote = useCallback(async (symbol: Stock) => {
    try {
      const response = await fetch(`/api/stocks/quote?symbol=${symbol}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch stock quote');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error);
      throw error;
    }
  }, []);

  // Preload data for all timeframes
  const preloadData = useCallback(async () => {
    if (selectedStocks.length === 0) return;

    setIsPreloading(true);
    setPreloadProgress(0);
    setError('');

    try {
      const totalRequests = selectedStocks.length * timeframes.length;
      let completedRequests = 0;

      // Fetch data for all timeframes for selected stocks
      for (const tf of timeframes) {
        for (const stock of selectedStocks) {
          try {
            const data = await fetchStockData(stock, tf.value);
            setChartData(prev => ({
              ...prev,
              [`${stock}_${tf.value}`]: data.prices || []
            }));
            
            completedRequests++;
            setPreloadProgress((completedRequests / totalRequests) * 100);
          } catch (error) {
            console.error(`Failed to preload ${stock} ${tf.value}:`, error);
          }
        }
      }

      // Fetch current quotes and info
      for (const stock of selectedStocks) {
        try {
          const quoteData = await fetchStockQuote(stock);

          setCurrentPrice(prev => ({
            ...prev,
            [stock]: quoteData.price
          }));

          setPriceChange(prev => ({
            ...prev,
            [stock]: {
              change: quoteData.change,
              percent: quoteData.changePercent
            }
          }));
        } catch (error) {
          console.error(`Failed to fetch quote/info for ${stock}:`, error);
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to preload data');
    } finally {
      setIsPreloading(false);
    }
  }, [selectedStocks, fetchStockData, fetchStockQuote]);

  // Load data for current timeframe
  const loadCurrentData = useCallback(async () => {
    if (selectedStocks.length === 0) return;

    setIsLoading(true);
    setError('');

    try {
      const promises = selectedStocks.map(async (stock) => {
        const data = await fetchStockData(stock, timeframe);
        return { stock, data };
      });

      const results = await Promise.all(promises);
      
      const newChartData: StockData = {};
      results.forEach(({ stock, data }) => {
        newChartData[stock] = data.prices || [];
      });

      setChartData(prev => ({
        ...prev,
        ...newChartData
      }));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load chart data');
    } finally {
      setIsLoading(false);
    }
  }, [selectedStocks, timeframe, fetchStockData]);

  // Load data when component mounts or dependencies change
  useEffect(() => {
    preloadData();
  }, [preloadData]);

  useEffect(() => {
    if (!isPreloading) {
      loadCurrentData();
    }
  }, [loadCurrentData, isPreloading]);

  // Prepare chart data for Chart.js
  const prepareChartData = () => {
    const datasets = selectedStocks.map((stock, index) => {
      const data = chartData[stock] || [];
      const colors = [
        '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
        '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
      ];

      return {
        label: stock,
        data: data.map(point => ({
          x: new Date(point.timestamp),
          y: point.price
        })),
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length] + '20',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: colors[index % colors.length],
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
      };
    });

    return {
      datasets
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
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: function(context) {
            const date = new Date(context[0].parsed.x);
            return date.toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });
          },
          label: function(context) {
            return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: timeframe === '1d' || timeframe === '5d' ? 'hour' : 'day',
          displayFormats: {
            hour: 'HH:mm',
            day: 'MMM dd'
          }
        },
        grid: {
          color: '#374151',
        },
        ticks: {
          color: '#9CA3AF',
        },
      },
      y: {
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

  const handleStockToggle = (stock: Stock) => {
    setSelectedStocks(prev => 
      prev.includes(stock) 
        ? prev.filter(s => s !== stock)
        : [...prev, stock]
    );
  };

  const handleStockAdd = (stock: Stock) => {
    if (!selectedStocks.includes(stock)) {
      setSelectedStocks(prev => [...prev, stock]);
    }
    setShowStockModal(false);
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
            <h2 className="text-lg font-semibold text-white">Stock Market Charts</h2>
            <motion.button
              onClick={() => setShowStockModal(true)}
              className="px-3 py-2 bg-blue-600 border border-blue-500 rounded-md text-white text-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Stock
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

      {/* Selected Stocks Display */}
      {selectedStocks.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full p-4 bg-gray-900/30 border-b border-gray-800"
        >
          <div className="flex flex-wrap items-center gap-3">
            {selectedStocks.map((stock) => (
              <motion.div
                key={stock}
                className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md"
                whileHover={{ scale: 1.02 }}
              >
                <span className="text-lg">{stockIcons[stock]}</span>
                <span className="text-white font-medium">{stock}</span>
                {currentPrice[stock] && (
                  <span className="text-green-400 font-semibold">
                    ${currentPrice[stock].toLocaleString()}
                  </span>
                )}
                {priceChange[stock] && (
                  <span className={`text-sm font-medium ${
                    priceChange[stock].percent >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {priceChange[stock].percent >= 0 ? '+' : ''}{priceChange[stock].percent.toFixed(2)}%
                  </span>
                )}
                <button
                  onClick={() => handleStockToggle(stock)}
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
                  onClick={loadCurrentData}
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
        ) : selectedStocks.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <div className="text-6xl mb-4">📈</div>
              <div className="text-xl mb-2">No stocks selected</div>
              <div className="text-sm">Click &quot;Add Stock&quot; to start viewing charts</div>
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

      {/* Stock Selection Modal */}
      <AnimatePresence>
        {showStockModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowStockModal(false)}
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
                  Select Stocks
                </h3>
                <button
                  onClick={() => setShowStockModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {stocks.map((stock) => {
                  const isSelected = selectedStocks.includes(stock);
                  
                  return (
                    <motion.button
                      key={stock}
                      onClick={() => handleStockAdd(stock)}
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
                        <span className="text-2xl">{stockIcons[stock]}</span>
                        <div>
                          <div className="font-semibold text-sm">
                            {stock}
                          </div>
                          <div className="text-xs opacity-75 mt-1">
                            {stockNames[stock]}
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
