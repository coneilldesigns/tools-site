'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
}

interface StockInfo {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  marketCap: string;
  pe: string;
  dividend: string;
}

// Fallback stocks in case API fails
const fallbackStocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX', 'AMD', 'INTC'];

const stockIcons: Record<string, string> = {
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

// Default icon for unknown stocks
const getStockIcon = (symbol: string) => {
  return stockIcons[symbol] || '📈';
};

export default function StockTicker() {
  const [stocks, setStocks] = useState<string[]>(fallbackStocks);
  const [stockNames, setStockNames] = useState<Record<string, string>>({});
  const [stockSectors, setStockSectors] = useState<Record<string, string>>({});
  const [stockQuotes, setStockQuotes] = useState<Record<string, StockQuote>>({});
  const [stockInfo, setStockInfo] = useState<Record<string, StockInfo>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'symbol' | 'change' | 'volume'>('symbol');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('Loading stock data...');

  // Fetch top stocks
  const fetchTopStocks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch('/api/stocks/top?limit=30');
      
      if (!response.ok) {
        throw new Error('Failed to fetch top stocks');
      }
      
      const data = await response.json();
      
      if (data.symbols && data.symbols.length > 0) {
        setStocks(data.symbols);
        setStockNames(data.names || {});
        setStockSectors(data.sectors || {});
        setLastUpdate(new Date());
      } else {
        throw new Error('No stock data received');
      }
    } catch (error) {
      console.error('Error fetching top stocks:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch stocks');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch stock quote
  const fetchStockQuote = useCallback(async (symbol: string) => {
    try {
      const response = await fetch(`/api/stocks/quote?symbol=${symbol}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch stock quote');
      }
      
      const data = await response.json();
      return { symbol, ...data };
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error);
      throw error;
    }
  }, []);

  // Fetch stock information
  const fetchStockInfo = useCallback(async (symbol: string) => {
    try {
      const response = await fetch(`/api/stocks/info?symbol=${symbol}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch stock info');
      }
      
      const data = await response.json();
      return { symbol, ...data };
    } catch (error) {
      console.error(`Error fetching info for ${symbol}:`, error);
      throw error;
    }
  }, []);

  // Load all stock data
  const loadStockData = useCallback(async () => {
    setIsLoading(true);
    setError('');
    setLoadingProgress(0);
    setLoadingMessage('Loading top stocks...');

    try {
      // First, fetch the top stocks
      await fetchTopStocks();

      setLoadingMessage('Loading stock quotes and info...');

      // Load stocks in smaller batches to avoid rate limiting
      const batchSize = 5; // Process 5 stocks at a time
      const batches = [];
      
      for (let i = 0; i < stocks.length; i += batchSize) {
        batches.push(stocks.slice(i, i + batchSize));
      }

      const allQuotes: Record<string, StockQuote> = {};
      const allInfo: Record<string, StockInfo> = {};

      // Process batches sequentially with delays
      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        const progress = ((i + 1) / batches.length) * 100;
        setLoadingProgress(progress);
        setLoadingMessage(`Loading batch ${i + 1}/${batches.length}: ${batch.join(', ')}`);
        
        console.log(`Processing batch ${i + 1}/${batches.length}: ${batch.join(', ')}`);

        // Fetch quotes and info for this batch
        const quotePromises = batch.map(symbol => fetchStockQuote(symbol).catch(error => {
          console.error(`Failed to fetch quote for ${symbol}:`, error);
          return null;
        }));
        
        const infoPromises = batch.map(symbol => fetchStockInfo(symbol).catch(error => {
          console.error(`Failed to fetch info for ${symbol}:`, error);
          return null;
        }));

        const [quoteResults, infoResults] = await Promise.all([
          Promise.all(quotePromises),
          Promise.all(infoPromises)
        ]);

        // Process results
        quoteResults.forEach((quote) => {
          if (quote) {
            allQuotes[quote.symbol] = quote;
          }
        });

        infoResults.forEach((info) => {
          if (info) {
            allInfo[info.symbol] = info;
          }
        });

        // Add delay between batches (except for the last batch)
        if (i < batches.length - 1) {
          setLoadingMessage(`Waiting before next batch...`);
          await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay between batches
        }
      }

      setStockQuotes(allQuotes);
      setStockInfo(allInfo);

      console.log(`Successfully loaded ${Object.keys(allQuotes).length} quotes and ${Object.keys(allInfo).length} info records`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load stock data');
    } finally {
      setIsLoading(false);
      setLoadingProgress(0);
    }
  }, [fetchTopStocks, fetchStockQuote, fetchStockInfo, stocks]);

  // Auto-refresh data
  useEffect(() => {
    loadStockData();

    if (autoRefresh) {
      const interval = setInterval(loadStockData, 120000); // Refresh every 2 minutes instead of 30 seconds
      return () => clearInterval(interval);
    }
  }, [loadStockData, autoRefresh]);

  // Get unique sectors
  const uniqueSectors = ['All', ...Array.from(new Set(Object.values(stockSectors)))];

  // Filter and sort stocks
  const filteredAndSortedStocks = stocks
    .filter(stock => selectedSector === 'All' || stockSectors[stock] === selectedSector)
    .sort((a, b) => {
      const quoteA = stockQuotes[a];
      const quoteB = stockQuotes[b];

      if (!quoteA || !quoteB) return 0;

      switch (sortBy) {
        case 'symbol':
          return sortOrder === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
        case 'change':
          return sortOrder === 'asc' 
            ? quoteA.changePercent - quoteB.changePercent
            : quoteB.changePercent - quoteA.changePercent;
        case 'volume':
          return sortOrder === 'asc'
            ? quoteA.volume - quoteB.volume
            : quoteB.volume - quoteA.volume;
        default:
          return 0;
      }
    });

  const formatNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toString();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const refreshData = useCallback(async () => {
    await loadStockData();
  }, [loadStockData]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full p-4 bg-gray-900/50 border-b border-gray-800"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-white">Stock Market Ticker</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">
              Last update: {lastUpdate.toLocaleTimeString()}
            </div>
            <motion.button
              onClick={refreshData}
              disabled={isLoading}
              className="px-3 py-2 bg-blue-600 border border-blue-500 rounded-md text-white text-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: isLoading ? 1 : 1.05 }}
              whileTap={{ scale: isLoading ? 1 : 0.95 }}
            >
              <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full p-4 bg-gray-900/30 border-b border-gray-800"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                autoRefresh
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
              {autoRefresh ? 'Auto Refresh On' : 'Auto Refresh Off'}
            </motion.button>
            
            {error && (
              <div className="px-2 py-1 bg-red-600/20 border border-red-500/30 rounded text-red-400 text-xs">
                {error}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Sector Filter */}
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="px-3 py-2 bg-gray-800 text-white rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {uniqueSectors.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>

            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'symbol' | 'change' | 'volume')}
              className="px-3 py-2 bg-gray-800 text-white rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="symbol">Sort by Symbol</option>
              <option value="change">Sort by Change %</option>
              <option value="volume">Sort by Volume</option>
            </select>

            <motion.button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stock Grid */}
      <div className="flex-1 w-full p-4 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <div className="text-gray-400">{loadingMessage}</div>
              <div className="w-64 bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-500">{Math.round(loadingProgress)}% complete</div>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-red-400 mb-4 max-w-md">{error}</div>
              <div className="flex gap-2 justify-center">
                <motion.button
                  onClick={loadStockData}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Retry
                </motion.button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {filteredAndSortedStocks.map((stock) => {
              const quote = stockQuotes[stock];
              const info = stockInfo[stock];
              
              if (!quote) return null;

              const isPositive = quote.changePercent >= 0;
              const isNegative = quote.changePercent < 0;

              return (
                <motion.div
                  key={stock}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`bg-gray-800 border rounded-lg p-4 hover:shadow-lg transition-all duration-200 cursor-pointer ${
                    isPositive ? 'border-green-500/30 hover:border-green-500/50' :
                    isNegative ? 'border-red-500/30 hover:border-red-500/50' :
                    'border-gray-700 hover:border-gray-600'
                  }`}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getStockIcon(stock)}</span>
                      <div>
                        <div className="font-bold text-white">{stock}</div>
                        <div className="text-xs text-gray-400">
                          {stockNames[stock] || stock}
                        </div>
                      </div>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      stockSectors[stock] === 'Technology' ? 'bg-blue-500/20 text-blue-300' :
                      stockSectors[stock] === 'Financial Services' ? 'bg-green-500/20 text-green-300' :
                      stockSectors[stock] === 'Communication Services' ? 'bg-purple-500/20 text-purple-300' :
                      stockSectors[stock] === 'Consumer Cyclical' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-gray-500/20 text-gray-300'
                    }`}>
                      {stockSectors[stock] || 'Unknown'}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-2xl font-bold text-white mb-2">
                    {formatPrice(quote.price)}
                  </div>

                  {/* Change */}
                  <div className="flex items-center justify-between mb-3">
                    <div className={`flex items-center gap-1 ${
                      isPositive ? 'text-green-400' : 'text-red-400'
                    }`}>
                      <span className="text-sm font-medium">
                        {isPositive ? '+' : ''}{quote.changePercent.toFixed(2)}%
                      </span>
                      <span className="text-xs">
                        ({isPositive ? '+' : ''}{formatPrice(quote.change)})
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Vol: {formatNumber(quote.volume)}
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                    <div>
                      <div className="text-gray-500">Open</div>
                      <div className="text-white">{formatPrice(quote.open)}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">High</div>
                      <div className="text-white">{formatPrice(quote.high)}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Low</div>
                      <div className="text-white">{formatPrice(quote.low)}</div>
                    </div>
                    {info && (
                      <div>
                        <div className="text-gray-500">Market Cap</div>
                        <div className="text-white">{info.marketCap !== 'N/A' ? formatNumber(parseInt(info.marketCap)) : 'N/A'}</div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {!isLoading && !error && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full p-4 bg-gray-900/30 border-t border-gray-800"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-400">
            <div>Showing {filteredAndSortedStocks.length} stocks</div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Gainers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Losers</span>
              </div>
            </div>
            <div>Last updated: {new Date().toLocaleTimeString()}</div>
          </div>
        </motion.div>
      )}
    </div>
  );
} 