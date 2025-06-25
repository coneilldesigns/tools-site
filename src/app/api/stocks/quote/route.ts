import { NextRequest, NextResponse } from 'next/server';

// Cache for stock quotes
interface QuoteCacheEntry {
  data: {
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    high: number;
    low: number;
    open: number;
  };
  timestamp: number;
}

const quoteCache: Record<string, QuoteCacheEntry> = {};
const QUOTE_CACHE_TTL = 60 * 1000; // 1 minute cache

// Rate limiting
let lastApiCall = 0;
const API_CALL_INTERVAL = 12000; // 12 seconds between calls

// Polygon.io API Key
const POLYGON_API_KEY = process.env.POLYGON_API_KEY || '_zUlp8wx_KIjgqQy_BI99U4Q70cq6SbH';

// Helper function to delay API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fallback to Alpha Vantage (free tier)
const fetchFromAlphaVantage = async (symbol: string) => {
  const url = new URL('https://www.alphavantage.co/query');
  url.searchParams.set('function', 'GLOBAL_QUOTE');
  url.searchParams.set('symbol', symbol);
  url.searchParams.set('apikey', 'demo'); // Using demo key for fallback
  
  const response = await fetch(url.toString(), {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (compatible; StockQuote/1.0)',
    },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(`Alpha Vantage API responded with status: ${response.status}`);
  }

  const data = await response.json();
  
  if (data['Error Message']) {
    throw new Error(data['Error Message']);
  }
  
  if (data['Note'] || data['Information']) {
    throw new Error('Rate limit exceeded');
  }
  
  const quoteData = data['Global Quote'];
  
  if (!quoteData || !quoteData['05. price']) {
    throw new Error('No quote data found');
  }

  return {
    price: parseFloat(quoteData['05. price'] || '0'),
    change: parseFloat(quoteData['09. change'] || '0'),
    changePercent: parseFloat(quoteData['10. change percent']?.replace('%', '') || '0'),
    volume: parseInt(quoteData['06. volume'] || '0'),
    high: parseFloat(quoteData['03. high'] || '0'),
    low: parseFloat(quoteData['04. low'] || '0'),
    open: parseFloat(quoteData['02. open'] || '0'),
  };
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  if (!symbol) {
    return NextResponse.json(
      { error: 'Symbol parameter is required' },
      { status: 400 }
    );
  }

  const cacheKey = symbol.toUpperCase();
  const now = Date.now();

  // Check cache first
  if (quoteCache[cacheKey] && now - quoteCache[cacheKey].timestamp < QUOTE_CACHE_TTL) {
    console.log(`Quote cache hit for ${symbol}`);
    return NextResponse.json(quoteCache[cacheKey].data);
  }

  // Rate limiting
  const timeSinceLastCall = now - lastApiCall;
  if (timeSinceLastCall < API_CALL_INTERVAL) {
    const waitTime = API_CALL_INTERVAL - timeSinceLastCall;
    console.log(`Rate limiting: waiting ${waitTime}ms before API call for ${symbol}`);
    await delay(waitTime);
  }

  try {
    // Try Polygon.io first (free tier endpoints)
    const url = new URL('https://api.polygon.io/v2/aggs/ticker/' + symbol + '/prev');
    url.searchParams.set('adjusted', 'true');
    url.searchParams.set('apikey', POLYGON_API_KEY);
    
    console.log(`Fetching quote from Polygon.io: ${symbol}`);
    lastApiCall = Date.now();
    
    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; StockQuote/1.0)',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (response.ok) {
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        const quote = {
          price: result.c, // Close price
          change: result.c - result.o, // Close - Open
          changePercent: ((result.c - result.o) / result.o) * 100,
          volume: result.v,
          high: result.h,
          low: result.l,
          open: result.o,
        };

        // Store in cache
        quoteCache[cacheKey] = { 
          data: quote, 
          timestamp: now
        };

        console.log(`Successfully fetched quote for ${symbol}: $${quote.price}`);
        return NextResponse.json(quote);
      }
    }

    // Fallback to Alpha Vantage
    console.log(`Polygon.io failed, trying Alpha Vantage for ${symbol}`);
    const fallbackQuote = await fetchFromAlphaVantage(symbol);
    
    // Store in cache
    quoteCache[cacheKey] = { 
      data: fallbackQuote, 
      timestamp: now
    };

    console.log(`Successfully fetched fallback quote for ${symbol}: $${fallbackQuote.price}`);
    return NextResponse.json(fallbackQuote);

  } catch (error) {
    console.error(`Error fetching stock quote for ${symbol}:`, error);
    
    // Return cached data if available, even if expired
    if (quoteCache[cacheKey]) {
      console.log(`Returning expired cache for ${symbol}`);
      return NextResponse.json(quoteCache[cacheKey].data);
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch stock quote' },
      { status: 500 }
    );
  }
}

// Cleanup function for quote cache
setInterval(() => {
  const now = Date.now();
  let cleanedCount = 0;
  
  Object.keys(quoteCache).forEach(key => {
    if (now - quoteCache[key].timestamp > QUOTE_CACHE_TTL * 2) {
      delete quoteCache[key];
      cleanedCount++;
    }
  });
  
  if (cleanedCount > 0) {
    console.log(`Cleaned up ${cleanedCount} expired quote cache entries`);
  }
}, 30 * 60 * 1000); // Run cleanup every 30 minutes 