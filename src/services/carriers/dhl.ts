import { BaseCarrierService } from './base';
import { CarrierConfig, CarrierResponse, TrackingInfo } from './types';

interface DHLEvent {
  timestamp: string;
  status?: string;
  location?: string;
  description?: string;
}

interface DHLPackage {
  status?: string;
  trackingHistory?: DHLEvent[];
  estimatedDeliveryDate?: string;
  serviceType?: string;
  weight?: {
    value: string;
    unit: string;
  };
  dimensions?: {
    length: string;
    width: string;
    height: string;
    unit: string;
  };
  origin?: {
    city?: string;
  };
  destination?: {
    city?: string;
  };
}

interface DHLResponse {
  packages?: DHLPackage[];
}

export class DHLCarrierService extends BaseCarrierService {
  constructor(config: CarrierConfig) {
    super(config);
  }

  async getTrackingInfo(trackingNumber: string): Promise<CarrierResponse> {
    try {
      console.log('📦 Requesting DHL tracking info...');
      const response = await fetch(
        `${this.config.baseUrl}/tracking/v4/package/open?trackingId=${trackingNumber}`,
        {
          headers: {
            'DHL-API-Key': this.config.apiKey || '',
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'EverydayTools/1.0',
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ DHL API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          url: `${this.config.baseUrl}/tracking/v4/package/open?trackingId=${trackingNumber}`,
        });
        return {
          success: false,
          error: {
            code: 'DHL_API_ERROR',
            message: `DHL API error: ${response.status} ${response.statusText}`
          }
        };
      }

      const data = await response.json() as DHLResponse;
      console.log('✅ DHL API Response:', JSON.stringify(data, null, 2));

      if (!data.packages?.[0]) {
        return {
          success: false,
          error: {
            code: 'DHL_NO_DATA',
            message: 'No package data found'
          }
        };
      }

      const transformedData = this.transformResponse(data);
      return {
        success: true,
        data: transformedData
      };
    } catch (error) {
      console.error('❌ DHL Service Error:', error);
      return {
        success: false,
        error: {
          code: 'DHL_SERVICE_ERROR',
          message: error instanceof Error ? error.message : 'An unexpected error occurred'
        }
      };
    }
  }

  protected transformResponse(data: DHLResponse): TrackingInfo {
    const pkg = data.packages?.[0];
    if (!pkg) {
      throw new Error('No package data found');
    }

    const events = pkg.trackingHistory || [];
    
    // Sort events by timestamp (newest first)
    events.sort((a: DHLEvent, b: DHLEvent) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return dateB - dateA;
    });

    return {
      status: pkg.status || 'Unknown',
      location: events[0]?.location || 'Unknown',
      estimatedDelivery: pkg.estimatedDeliveryDate,
      lastUpdate: events[0]?.timestamp,
      events: events.map((event: DHLEvent) => ({
        status: event.status || 'Unknown',
        location: event.location || 'Unknown',
        timestamp: event.timestamp,
        description: event.description || 'Unknown',
      })),
      details: {
        service: pkg.serviceType,
        weight: pkg.weight ? `${pkg.weight.value} ${pkg.weight.unit}` : undefined,
        dimensions: pkg.dimensions 
          ? `${pkg.dimensions.length}x${pkg.dimensions.width}x${pkg.dimensions.height} ${pkg.dimensions.unit}`
          : undefined,
        origin: pkg.origin?.city,
        destination: pkg.destination?.city,
      }
    };
  }
} 