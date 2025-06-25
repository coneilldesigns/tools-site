# Stock Chart Setup Guide

## Overview
The Stock Chart tool provides real-time stock market data visualization using the Alpha Vantage API. It allows users to track multiple stocks, view price charts across different timeframes, and get current market data.

## Features
- Real-time stock price charts
- Multiple timeframe support (1D, 5D, 1M, 3M, 6M, 1Y, 2Y, 5Y)
- Support for 30+ popular stocks (AAPL, MSFT, GOOGL, etc.)
- Current price and percentage change display
- Interactive charts with tooltips
- Responsive design with dark mode support

## API Setup

### 1. Get Alpha Vantage API Key
1. Visit [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
2. Sign up for a free account
3. Get your API key from the dashboard

### 2. Environment Configuration
Create a `.env.local` file in your project root and add:

```env
ALPHA_VANTAGE_API_KEY=your_api_key_here
```

### 3. API Rate Limits
- Free tier: 5 API calls per minute, 500 per day
- The app includes intelligent caching to minimize API calls
- Different timeframes have different cache durations

## Usage

### Adding Stocks
1. Click "Add Stock" button
2. Select from the list of available stocks
3. View real-time price data and charts

### Timeframes
- **1D/5D**: Intraday data (5min/15min intervals)
- **1M**: Hourly data
- **3M/6M/1Y/2Y/5Y**: Daily data

### Features
- **Multi-stock comparison**: Add multiple stocks to compare performance
- **Real-time updates**: Current prices and percentage changes
- **Interactive charts**: Hover for detailed price information
- **Responsive design**: Works on desktop and mobile devices

## Technical Details

### API Endpoints
- `/api/stocks/chart` - Historical price data
- `/api/stocks/quote` - Current stock quotes
- `/api/stocks/info` - Company information

### Caching Strategy
- Chart data: 5 minutes to 12 hours (based on timeframe)
- Quote data: 2 minutes
- Company info: 24 hours

### Supported Stocks
The tool supports 30+ major stocks including:
- Technology: AAPL, MSFT, GOOGL, AMZN, TSLA, META, NVDA
- Entertainment: NFLX, SPOT, ROKU, SNAP
- Finance: PYPL, SQ, COIN, HOOD
- And many more...

## Troubleshooting

### Common Issues
1. **Rate limit exceeded**: Wait a few minutes and try again
2. **No data available**: Check if the stock symbol is supported
3. **API key error**: Verify your Alpha Vantage API key is correct

### Performance Tips
- Use shorter timeframes for faster loading
- The app preloads data for better user experience
- Cache reduces API calls and improves performance

## Dependencies
- Chart.js with date-fns adapter
- Alpha Vantage API
- React and Next.js
- Framer Motion for animations 