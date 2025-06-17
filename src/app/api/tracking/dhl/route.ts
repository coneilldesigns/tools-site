import { NextResponse } from 'next/server';
import { DHLCarrierService } from '@/services/carriers/dhl';
import { carriers } from '@/services/carriers';

export async function POST(request: Request) {
  try {
    const { trackingNumber } = await request.json();
    
    if (!trackingNumber) {
      return NextResponse.json(
        { success: false, error: 'Tracking number is required' },
        { status: 400 }
      );
    }

    const config = carriers.dhl;
    if (!config.apiKey || !config.apiSecret) {
      return NextResponse.json(
        { success: false, error: 'DHL API credentials are not configured' },
        { status: 500 }
      );
    }

    console.log('🚀 Initializing DHL service...');
    const service = new DHLCarrierService(config);
    
    console.log('📦 Requesting tracking info...');
    const result = await service.getTrackingInfo(trackingNumber);
    
    console.log('✅ DHL API Response:', JSON.stringify(result, null, 2));
    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ DHL API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: {
          code: 'DHL_API_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get tracking information'
        }
      },
      { status: 500 }
    );
  }
} 