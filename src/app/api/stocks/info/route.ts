import { NextRequest, NextResponse } from 'next/server';

// Cache for stock information
interface InfoCacheEntry {
  data: {
    symbol: string;
    name: string;
    sector: string;
    industry: string;
    marketCap: string;
    pe: string;
    dividend: string;
    description: string;
    exchange: string;
    currency: string;
    country: string;
  };
  timestamp: number;
}

const infoCache: Record<string, InfoCacheEntry> = {};
const INFO_CACHE_TTL = 60 * 60 * 1000; // 1 hour cache

// Rate limiting
let lastApiCall = 0;
const API_CALL_INTERVAL = 12000; // 12 seconds between calls

// Polygon.io API Key
const POLYGON_API_KEY = process.env.POLYGON_API_KEY || '_zUlp8wx_KIjgqQy_BI99U4Q70cq6SbH';

// Helper function to delay API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fallback company data
const fallbackCompanyData: Record<string, { name: string; sector: string }> = {
  'AAPL': { name: 'Apple Inc.', sector: 'Technology' },
  'MSFT': { name: 'Microsoft Corporation', sector: 'Technology' },
  'GOOGL': { name: 'Alphabet Inc.', sector: 'Technology' },
  'AMZN': { name: 'Amazon.com Inc.', sector: 'Consumer Cyclical' },
  'TSLA': { name: 'Tesla Inc.', sector: 'Consumer Cyclical' },
  'META': { name: 'Meta Platforms Inc.', sector: 'Technology' },
  'NVDA': { name: 'NVIDIA Corporation', sector: 'Technology' },
  'NFLX': { name: 'Netflix Inc.', sector: 'Communication Services' },
  'AMD': { name: 'Advanced Micro Devices', sector: 'Technology' },
  'INTC': { name: 'Intel Corporation', sector: 'Technology' },
  'CRM': { name: 'Salesforce Inc.', sector: 'Technology' },
  'ORCL': { name: 'Oracle Corporation', sector: 'Technology' },
  'ADBE': { name: 'Adobe Inc.', sector: 'Technology' },
  'PYPL': { name: 'PayPal Holdings Inc.', sector: 'Financial Services' },
  'UBER': { name: 'Uber Technologies Inc.', sector: 'Technology' },
  'SPOT': { name: 'Spotify Technology S.A.', sector: 'Communication Services' },
  'ZM': { name: 'Zoom Video Communications', sector: 'Technology' },
  'SHOP': { name: 'Shopify Inc.', sector: 'Technology' },
  'SQ': { name: 'Block Inc.', sector: 'Technology' },
  'ROKU': { name: 'Roku Inc.', sector: 'Communication Services' },
  'SNAP': { name: 'Snap Inc.', sector: 'Communication Services' },
  'TWTR': { name: 'Twitter Inc.', sector: 'Communication Services' },
  'LYFT': { name: 'Lyft Inc.', sector: 'Technology' },
  'PINS': { name: 'Pinterest Inc.', sector: 'Communication Services' },
  'BYND': { name: 'Beyond Meat Inc.', sector: 'Consumer Defensive' },
  'PLTR': { name: 'Palantir Technologies', sector: 'Technology' },
  'COIN': { name: 'Coinbase Global Inc.', sector: 'Financial Services' },
  'HOOD': { name: 'Robinhood Markets Inc.', sector: 'Financial Services' },
  'RBLX': { name: 'Roblox Corporation', sector: 'Communication Services' },
  'PATH': { name: 'UiPath Inc.', sector: 'Technology' },
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
  if (infoCache[cacheKey] && now - infoCache[cacheKey].timestamp < INFO_CACHE_TTL) {
    console.log(`Info cache hit for ${symbol}`);
    return NextResponse.json(infoCache[cacheKey].data);
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
    const url = new URL(`https://api.polygon.io/v3/reference/tickers/${symbol}`);
    url.searchParams.set('apikey', POLYGON_API_KEY);
    
    console.log(`Fetching company info from Polygon.io: ${symbol}`);
    lastApiCall = Date.now();
    
    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; StockInfo/1.0)',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (response.ok) {
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (data.results) {
        const company = data.results;
        
        const result = {
          symbol: company.ticker || symbol,
          name: company.name || symbol,
          sector: company.sic_description || 'Unknown',
          industry: company.market_cap ? 'Public Company' : 'Unknown',
          marketCap: company.market_cap ? `$${(company.market_cap / 1000000000).toFixed(2)}B` : 'N/A',
          pe: 'N/A', // Polygon.io doesn't provide PE ratio in basic ticker info
          dividend: 'N/A', // Polygon.io doesn't provide dividend info in basic ticker info
          description: company.description || 'No description available.',
          exchange: company.primary_exchange || 'Unknown',
          currency: company.currency_name || 'USD',
          country: company.locale || 'US',
        };

        // Store in cache
        infoCache[cacheKey] = { 
          data: result, 
          timestamp: now
        };

        console.log(`Successfully fetched info for ${symbol}: ${result.name}`);
        return NextResponse.json(result);
      }
    }

    // Fallback to hardcoded data
    console.log(`Polygon.io failed, using fallback data for ${symbol}`);
    const fallbackData = fallbackCompanyData[symbol.toUpperCase()];
    
    const result = {
      symbol: symbol,
      name: fallbackData?.name || symbol,
      sector: fallbackData?.sector || 'Unknown',
      industry: 'Public Company',
      marketCap: 'N/A',
      pe: 'N/A',
      dividend: 'N/A',
      description: 'Company information not available.',
      exchange: 'Unknown',
      currency: 'USD',
      country: 'US',
    };

    // Store in cache
    infoCache[cacheKey] = { 
      data: result, 
      timestamp: now
    };

    console.log(`Using fallback info for ${symbol}: ${result.name}`);
    return NextResponse.json(result);

  } catch (error) {
    console.error(`Error fetching stock info for ${symbol}:`, error);
    
    // Return cached data if available, even if expired
    if (infoCache[cacheKey]) {
      console.log(`Returning expired cache for ${symbol}`);
      return NextResponse.json(infoCache[cacheKey].data);
    }
    
    // Return fallback data
    const fallbackData = fallbackCompanyData[symbol.toUpperCase()];
    const result = {
      symbol: symbol,
      name: fallbackData?.name || symbol,
      sector: fallbackData?.sector || 'Unknown',
      industry: 'Public Company',
      marketCap: 'N/A',
      pe: 'N/A',
      dividend: 'N/A',
      description: 'Company information not available.',
      exchange: 'Unknown',
      currency: 'USD',
      country: 'US',
    };

    return NextResponse.json(result);
  }
}

// Cleanup function for info cache
setInterval(() => {
  const now = Date.now();
  let cleanedCount = 0;
  
  Object.keys(infoCache).forEach(key => {
    if (now - infoCache[key].timestamp > INFO_CACHE_TTL * 2) {
      delete infoCache[key];
      cleanedCount++;
    }
  });
  
  if (cleanedCount > 0) {
    console.log(`Cleaned up ${cleanedCount} expired info cache entries`);
  }
}, 60 * 60 * 1000); // Run cleanup every hour 