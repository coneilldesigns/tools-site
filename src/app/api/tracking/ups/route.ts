import { NextResponse } from 'next/server';
import { carriers } from '@/services/carriers';

interface UPSActivity {
  date: string;
  time: string;
  status?: {
    description: string;
  };
  location?: {
    address?: {
      city?: string;
      countryCode?: string;
    };
  };
}

interface UPSPackage {
  currentStatus?: {
    description: string;
  };
  activity?: UPSActivity[];
  deliveryDate?: Array<{
    date: string;
  }>;
  service?: {
    description: string;
  };
  weight?: {
    weight: string;
    unitOfMeasurement: string;
  };
  dimension?: {
    length: string;
    width: string;
    height: string;
    unitOfDimension: string;
  };
  packageAddress?: Array<{
    type: string;
    address?: {
      city?: string;
    };
  }>;
}

interface UPSTrackingResponse {
  trackResponse?: {
    shipment?: Array<{
      package?: UPSPackage[];
    }>;
  };
}

interface TransformedTrackingData {
  status: string;
  location: string;
  estimatedDelivery?: string;
  lastUpdate: string | null;
  events: Array<{
    status: string;
    location: string;
    timestamp: string;
    description: string;
  }>;
  details: {
    service?: string;
    weight: string | null;
    dimensions: string | null;
    origin?: string;
    destination?: string;
  };
}

function transformTrackingData(data: UPSTrackingResponse): TransformedTrackingData | null {
  if (!data?.trackResponse?.shipment?.[0]?.package?.[0]) {
    return null;
  }

  const pkg = data.trackResponse.shipment[0].package[0];
  const activities = pkg.activity || [];
  
  // Sort activities by date and time (newest first)
  activities.sort((a: UPSActivity, b: UPSActivity) => {
    const dateA = `${a.date}${a.time}`;
    const dateB = `${b.date}${b.time}`;
    return dateB.localeCompare(dateA);
  });

  return {
    status: pkg.currentStatus?.description || 'Unknown',
    location: activities[0]?.location?.address?.city || 'Unknown',
    estimatedDelivery: pkg.deliveryDate?.[0]?.date,
    lastUpdate: activities[0] ? `${activities[0].date} ${activities[0].time}` : null,
    events: activities.map((activity: UPSActivity) => ({
      status: activity.status?.description || 'Unknown',
      location: activity.location?.address?.city 
        ? `${activity.location.address.city}, ${activity.location.address.countryCode}`
        : 'Unknown',
      timestamp: `${activity.date} ${activity.time}`,
      description: activity.status?.description || 'Unknown',
    })),
    details: {
      service: pkg.service?.description,
      weight: pkg.weight ? `${pkg.weight.weight} ${pkg.weight.unitOfMeasurement}` : null,
      dimensions: pkg.dimension ? `${pkg.dimension.length}x${pkg.dimension.width}x${pkg.dimension.height} ${pkg.dimension.unitOfDimension}` : null,
      origin: pkg.packageAddress?.find((addr) => addr.type === 'ORIGIN')?.address?.city,
      destination: pkg.packageAddress?.find((addr) => addr.type === 'DESTINATION')?.address?.city,
    }
  };
}

export async function POST(request: Request) {
  try {
    const { trackingNumber } = await request.json();

    if (!trackingNumber) {
      return NextResponse.json(
        { success: false, error: 'Tracking number is required' },
        { status: 400 }
      );
    }

    const config = carriers.ups;
    if (!config.apiKey || !config.apiSecret) {
      return NextResponse.json(
        { success: false, error: 'UPS API credentials are not configured' },
        { status: 500 }
      );
    }

    console.log('🔑 Requesting UPS OAuth token...');
    // Get OAuth token
    const basicAuth = Buffer.from(`${config.apiKey}:${config.apiSecret}`).toString('base64');
    const tokenResponse = await fetch(`${config.baseUrl}/security/v1/oauth/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'User-Agent': 'EverydayTools/1.0',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json().catch(() => ({}));
      console.error('❌ UPS OAuth Error:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        error: errorData,
        url: `${config.baseUrl}/security/v1/oauth/token`,
      });
      return NextResponse.json(
        { success: false, error: 'Failed to get UPS OAuth token' },
        { status: tokenResponse.status }
      );
    }

    const tokenData = await tokenResponse.json();
    console.log('✅ UPS OAuth Response:', {
      access_token: tokenData.access_token ? '***' : undefined,
      token_type: tokenData.token_type,
      expires_in: tokenData.expires_in,
    });

    // Get tracking info
    console.log('📦 Requesting UPS tracking info...');
    const queryParams = new URLSearchParams({
      locale: 'en_US',
      returnSignature: 'false',
      returnMilestones: 'false',
      returnPOD: 'false',
    });

    const trackingResponse = await fetch(
      `${config.baseUrl}/api/track/v1/details/${trackingNumber}?${queryParams}`,
      {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'EverydayTools/1.0',
          'transId': `track_${Date.now()}`,
          'transactionSrc': 'EverydayTools',
        },
      }
    );

    if (!trackingResponse.ok) {
      const errorData = await trackingResponse.json().catch(() => ({}));
      console.error('❌ UPS Tracking Error:', {
        status: trackingResponse.status,
        statusText: trackingResponse.statusText,
        error: errorData,
        url: `${config.baseUrl}/api/track/v1/details/${trackingNumber}`,
      });
      return NextResponse.json(
        { success: false, error: 'Failed to get UPS tracking information' },
        { status: trackingResponse.status }
      );
    }

    const data = await trackingResponse.json();
    const transformedData = transformTrackingData(data);
    
    console.log('✅ UPS Tracking Response:', {
      status: transformedData?.status,
      location: transformedData?.location,
      lastUpdate: transformedData?.lastUpdate,
      events: transformedData?.events?.length,
      details: transformedData?.details,
    });
    
    return NextResponse.json({ success: true, data: transformedData });
  } catch (error) {
    console.error('❌ UPS API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 