import { NextRequest, NextResponse } from 'next/server';
import { FedExCarrierService } from '@/services/carriers/fedex';
import { carriers } from '@/services/carriers';

export async function POST(req: NextRequest) {
  try {
    const { trackingNumber } = await req.json();
    
    if (!trackingNumber) {
      return NextResponse.json(
        { success: false, error: 'Tracking number is required' },
        { status: 400 }
      );
    }

    const config = carriers.fedex;
    if (!config.apiKey || !config.apiSecret) {
      return NextResponse.json(
        { success: false, error: 'FedEx API credentials are not configured' },
        { status: 500 }
      );
    }

    console.log('🚀 Initializing FedEx service...');
    const service = new FedExCarrierService(config);
    
    console.log('📦 Requesting tracking info...');
    const result = await service.getTrackingInfo(trackingNumber);
    
    console.log('✅ FedEx API Response:', JSON.stringify(result, null, 2));
    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ FedEx API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: {
          code: 'FEDEX_API_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get tracking information'
        }
      },
      { status: 500 }
    );
  }
} 