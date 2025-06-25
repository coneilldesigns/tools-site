import { NextRequest, NextResponse } from 'next/server';

// Cache for chart data
interface ChartCacheEntry {
  data: {
    prices: Array<{
      timestamp: number;
      price: number;
      volume?: number;
    }>;
  };
  timestamp: number;
}

const chartCache: Record<string, ChartCacheEntry> = {};
const CHART_CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache

// Rate limiting
let lastApiCall = 0;
const API_CALL_INTERVAL = 12000; // 12 seconds between calls (5 calls per minute)

// Polygon.io API Key
const POLYGON_API_KEY = process.env.POLYGON_API_KEY || '_zUlp8wx_KIjgqQy_BI99U4Q70cq6SbH';

// Interface for Polygon.io API response
interface PolygonBar {
  t: number; // timestamp
  o: number; // open
  h: number; // high
  l: number; // low
  c: number; // close
  v: number; // volume
  n?: number; // number of transactions
  vw?: number; // volume weighted average price
}

// Helper function to delay API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to get date range for timeframe
const getDateRange = (timeframe: string) => {
  const now = new Date();
  const end = new Date(now);
  
  switch (timeframe) {
    case '1d':
      end.setHours(16, 0, 0, 0); // Market close
      return {
        start: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        end: end,
        multiplier: 5,
        timespan: 'minute'
      };
    case '5d':
      return {
        start: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        end: end,
        multiplier: 15,
        timespan: 'minute'
      };
    case '1m':
      return {
        start: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        end: end,
        multiplier: 1,
        timespan: 'day'
      };
    case '3m':
      return {
        start: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
        end: end,
        multiplier: 1,
        timespan: 'day'
      };
    case '6m':
      return {
        start: new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000),
        end: end,
        multiplier: 1,
        timespan: 'day'
      };
    case '1y':
      return {
        start: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000),
        end: end,
        multiplier: 1,
        timespan: 'day'
      };
    case '2y':
      return {
        start: new Date(now.getTime() - 2 * 365 * 24 * 60 * 60 * 1000),
        end: end,
        multiplier: 1,
        timespan: 'day'
      };
    case '5y':
      return {
        start: new Date(now.getTime() - 5 * 365 * 24 * 60 * 60 * 1000),
        end: end,
        multiplier: 1,
        timespan: 'day'
      };
    default:
      return {
        start: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000),
        end: end,
        multiplier: 1,
        timespan: 'day'
      };
  }
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const timeframe = searchParams.get('timeframe') || '1y';

  if (!symbol) {
    return NextResponse.json(
      { error: 'Symbol parameter is required' },
      { status: 400 }
    );
  }

  const cacheKey = `${symbol.toUpperCase()}_${timeframe}`;
  const now = Date.now();

  // Check cache first
  if (chartCache[cacheKey] && now - chartCache[cacheKey].timestamp < CHART_CACHE_TTL) {
    console.log(`Chart cache hit for ${symbol} ${timeframe}`);
    return NextResponse.json(chartCache[cacheKey].data);
  }

  // Rate limiting
  const timeSinceLastCall = now - lastApiCall;
  if (timeSinceLastCall < API_CALL_INTERVAL) {
    const waitTime = API_CALL_INTERVAL - timeSinceLastCall;
    console.log(`Rate limiting: waiting ${waitTime}ms before API call for ${symbol}`);
    await delay(waitTime);
  }

  try {
    const { start, end, multiplier, timespan } = getDateRange(timeframe);
    
    // Format dates for Polygon.io API
    const from = start.toISOString().split('T')[0];
    const to = end.toISOString().split('T')[0];
    
    // Get historical data from Polygon.io
    const url = new URL(`https://api.polygon.io/v2/aggs/ticker/${symbol}/range/${multiplier}/${timespan}/${from}/${to}`);
    url.searchParams.set('adjusted', 'true');
    url.searchParams.set('sort', 'asc');
    url.searchParams.set('limit', '5000');
    url.searchParams.set('apikey', POLYGON_API_KEY);
    
    console.log(`Fetching chart data from Polygon.io: ${symbol} ${timeframe}`);
    lastApiCall = Date.now();
    
    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; StockChart/1.0)',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Polygon.io API error:', response.status, errorText);
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Check for API errors
    if (data.error) {
      throw new Error(data.error);
    }
    
    // Check if we got valid data
    if (!data.results || !Array.isArray(data.results)) {
      console.error('No chart data found for symbol:', symbol);
      throw new Error('No chart data found for this symbol');
    }

    // Transform Polygon.io data to our format
    const prices = data.results.map((bar: PolygonBar) => ({
      timestamp: bar.t, // Unix timestamp in milliseconds
      price: bar.c, // Close price
      volume: bar.v // Volume
    }));

    const result = {
      prices: prices
    };

    // Store in cache
    chartCache[cacheKey] = { 
      data: result, 
      timestamp: now
    };

    console.log(`Successfully fetched chart data for ${symbol} ${timeframe}: ${prices.length} data points`);
    return NextResponse.json(result);

  } catch (error) {
    console.error(`Error fetching chart data for ${symbol}:`, error);
    
    // Return cached data if available, even if expired
    if (chartCache[cacheKey]) {
      console.log(`Returning expired cache for ${symbol} ${timeframe}`);
      return NextResponse.json(chartCache[cacheKey].data);
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch chart data' },
      { status: 500 }
    );
  }
} 