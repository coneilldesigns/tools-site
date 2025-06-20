import { NextRequest, NextResponse } from 'next/server';

// Enhanced cache with different TTLs for different timeframes
interface CacheEntry {
  data: {
    prices: [number, number][];
    market_caps: [number, number][];
    total_volumes: [number, number][];
  };
  timestamp: number;
  timeframe: string;
}

const cache: Record<string, CacheEntry> = {};

// Cache TTLs in milliseconds
const CACHE_TTL = {
  '1d': 5 * 60 * 1000,      // 5 minutes for 1 day data
  '7d': 15 * 60 * 1000,     // 15 minutes for 7 day data
  '30d': 30 * 60 * 1000,    // 30 minutes for 30 day data
  '90d': 60 * 60 * 1000,    // 1 hour for 90 day data
  '1y': 2 * 60 * 60 * 1000, // 2 hours for 1 year data
};

// CoinGecko API Key
const COINGECKO_API_KEY = 'CG-YzdUcjMuGCnfyD4zKd4NU4Zv';

// Helper function to get days from timeframe
const getDaysFromTimeframe = (timeframe: string): number => {
  switch (timeframe) {
    case '1d': return 1;
    case '7d': return 7;
    case '30d': return 30;
    case '90d': return 90;
    case '1y': return 365;
    default: return 7;
  }
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const coinId = searchParams.get('coinId');
  const days = searchParams.get('days');

  if (!coinId || !days) {
    return NextResponse.json(
      { error: 'Missing required parameters: coinId and days' },
      { status: 400 }
    );
  }

  // Determine timeframe from days parameter
  const timeframe = Object.entries(CACHE_TTL).find(([tf]) => 
    getDaysFromTimeframe(tf) === parseInt(days)
  )?.[0] || '7d';

  // Cache key based on coin and timeframe
  const cacheKey = `${coinId}_${timeframe}`;
  const now = Date.now();
  const ttl = CACHE_TTL[timeframe as keyof typeof CACHE_TTL] || CACHE_TTL['7d'];

  // Check cache
  if (cache[cacheKey] && now - cache[cacheKey].timestamp < ttl) {
    console.log(`Cache hit for ${coinId} ${timeframe}`);
    return NextResponse.json(cache[cacheKey].data);
  }

  try {
    // Build the URL with proper parameters (no interval parameter for Demo plan)
    const url = new URL(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`);
    url.searchParams.set('vs_currency', 'usd');
    url.searchParams.set('days', days);
    
    console.log(`Fetching from CoinGecko: ${coinId} ${timeframe} (${days} days)`);
    
    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; CryptoChart/1.0)',
        'X-CG-Demo-API-Key': COINGECKO_API_KEY, // Add API key header
      },
      signal: AbortSignal.timeout(15000), // 15 second timeout for longer requests
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('CoinGecko API error:', response.status, errorText);
      
      if (response.status === 429) {
        return NextResponse.json(
          { 
            error: 'Rate limit exceeded. Please try again later.',
            retryAfter: response.headers.get('Retry-After') || '60'
          },
          { status: 429 }
        );
      }
      
      if (response.status === 401) {
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.error?.status?.error_code === 10012) {
            return NextResponse.json(
              { 
                error: 'Historical data beyond 1 year is not available with the current API plan. Please use 1Y or shorter timeframes.',
                details: 'CoinGecko Demo plan limits historical data to 365 days maximum.'
              },
              { status: 400 }
            );
          }
          if (errorData.status?.error_code === 10005) {
            return NextResponse.json(
              { 
                error: 'Hourly interval data is not available with the current API plan. Please use daily intervals.',
                details: 'CoinGecko Demo plan uses automatic interval selection based on the days parameter.'
              },
              { status: 400 }
            );
          }
        } catch {
          // If JSON parsing fails, continue with generic error
        }
      }
      
      throw new Error(`CoinGecko API responded with status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    // Validate the response structure
    if (!data.prices || !Array.isArray(data.prices)) {
      throw new Error('Invalid response format from CoinGecko API');
    }
    
    // Store in cache with timeframe info
    cache[cacheKey] = { 
      data, 
      timestamp: now,
      timeframe 
    };
    
    console.log(`Cached ${coinId} ${timeframe} data for ${Math.floor(ttl / 60000)} minutes`);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching crypto chart data:', error);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timeout. Please try again.' },
          { status: 408 }
        );
      }
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch crypto data. Please try again later.' },
      { status: 500 }
    );
  }
}

// Optional: Add a cleanup function to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  let cleanedCount = 0;
  
  Object.keys(cache).forEach(key => {
    const entry = cache[key];
    const ttl = CACHE_TTL[entry.timeframe as keyof typeof CACHE_TTL] || CACHE_TTL['7d'];
    
    if (now - entry.timestamp > ttl * 2) { // Clean up entries older than 2x TTL
      delete cache[key];
      cleanedCount++;
    }
  });
  
  if (cleanedCount > 0) {
    console.log(`Cleaned up ${cleanedCount} expired cache entries`);
  }
}, 60 * 60 * 1000); // Run cleanup every hour 