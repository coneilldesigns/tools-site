import { NextRequest, NextResponse } from 'next/server';

// Cache for top stocks
interface TopStocksCacheEntry {
  data: {
    symbols: string[];
    names: Record<string, string>;
    sectors: Record<string, string>;
  };
  timestamp: number;
}

let topStocksCache: TopStocksCacheEntry | null = null;
const TOP_STOCKS_CACHE_TTL = 60 * 60 * 1000; // 1 hour

// Popular stocks with known good data
const popularStocksData = {
  symbols: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX', 'AMD', 'INTC', 'CRM', 'ORCL', 'ADBE', 'PYPL', 'UBER', 'SPOT', 'ZM', 'SHOP', 'SQ', 'ROKU', 'SNAP', 'LYFT', 'PINS', 'BYND', 'PLTR', 'COIN', 'HOOD', 'RBLX', 'PATH'],
  names: {
    'AAPL': 'Apple Inc.',
    'MSFT': 'Microsoft Corporation',
    'GOOGL': 'Alphabet Inc.',
    'AMZN': 'Amazon.com Inc.',
    'TSLA': 'Tesla Inc.',
    'META': 'Meta Platforms Inc.',
    'NVDA': 'NVIDIA Corporation',
    'NFLX': 'Netflix Inc.',
    'AMD': 'Advanced Micro Devices',
    'INTC': 'Intel Corporation',
    'CRM': 'Salesforce Inc.',
    'ORCL': 'Oracle Corporation',
    'ADBE': 'Adobe Inc.',
    'PYPL': 'PayPal Holdings Inc.',
    'UBER': 'Uber Technologies Inc.',
    'SPOT': 'Spotify Technology S.A.',
    'ZM': 'Zoom Video Communications',
    'SHOP': 'Shopify Inc.',
    'SQ': 'Block Inc.',
    'ROKU': 'Roku Inc.',
    'SNAP': 'Snap Inc.',
    'LYFT': 'Lyft Inc.',
    'PINS': 'Pinterest Inc.',
    'BYND': 'Beyond Meat Inc.',
    'PLTR': 'Palantir Technologies',
    'COIN': 'Coinbase Global Inc.',
    'HOOD': 'Robinhood Markets Inc.',
    'RBLX': 'Roblox Corporation',
    'PATH': 'UiPath Inc.'
  },
  sectors: {
    'AAPL': 'Technology',
    'MSFT': 'Technology',
    'GOOGL': 'Technology',
    'AMZN': 'Consumer Cyclical',
    'TSLA': 'Consumer Cyclical',
    'META': 'Technology',
    'NVDA': 'Technology',
    'NFLX': 'Communication Services',
    'AMD': 'Technology',
    'INTC': 'Technology',
    'CRM': 'Technology',
    'ORCL': 'Technology',
    'ADBE': 'Technology',
    'PYPL': 'Financial Services',
    'UBER': 'Technology',
    'SPOT': 'Communication Services',
    'ZM': 'Technology',
    'SHOP': 'Technology',
    'SQ': 'Technology',
    'ROKU': 'Communication Services',
    'SNAP': 'Communication Services',
    'LYFT': 'Technology',
    'PINS': 'Communication Services',
    'BYND': 'Consumer Defensive',
    'PLTR': 'Technology',
    'COIN': 'Financial Services',
    'HOOD': 'Financial Services',
    'RBLX': 'Communication Services',
    'PATH': 'Technology'
  }
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '30');

  // Check cache
  const now = Date.now();
  if (topStocksCache && now - topStocksCache.timestamp < TOP_STOCKS_CACHE_TTL) {
    console.log('Top stocks cache hit');
    return NextResponse.json(topStocksCache.data);
  }

  try {
    // Return popular stocks (since gainers endpoint requires paid subscription)
    const result = {
      symbols: popularStocksData.symbols.slice(0, limit),
      names: popularStocksData.names,
      sectors: popularStocksData.sectors
    };
    
    // Cache the result
    topStocksCache = {
      data: result,
      timestamp: now
    };
    
    console.log(`Returning ${result.symbols.length} popular stocks`);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in top stocks API:', error);
    
    // Return fallback data on any error
    const result = {
      symbols: popularStocksData.symbols.slice(0, limit),
      names: popularStocksData.names,
      sectors: popularStocksData.sectors
    };
    
    // Cache the fallback data
    topStocksCache = {
      data: result,
      timestamp: now
    };
    
    console.log(`Using fallback data due to error: ${result.symbols.length} stocks`);
    return NextResponse.json(result);
  }
} 