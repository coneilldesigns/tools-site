import { BaseCarrierService } from './base';
import { CarrierResponse, TrackingInfo, CarrierConfig } from './types';

interface UPSAddress {
  city?: string;
  stateProvinceCode?: string;
}

interface UPSStatus {
  description?: string;
}

interface UPSActivity {
  status?: UPSStatus;
  location?: {
    address?: UPSAddress;
  };
  date?: string;
  time?: string;
}

interface UPSWeight {
  value?: string;
  unitOfMeasurement?: {
    code?: string;
  };
}

interface UPSDimensions {
  length?: string;
  width?: string;
  height?: string;
  unitOfMeasurement?: {
    code?: string;
  };
}

interface UPSPackage {
  status?: UPSStatus;
  deliveryDate?: {
    date?: string;
  };
  activity?: UPSActivity[];
  service?: {
    description?: string;
  };
  weight?: UPSWeight;
  dimensions?: UPSDimensions;
}

interface UPSShipment {
  package?: UPSPackage;
  shipper?: {
    address?: UPSAddress;
  };
  shipTo?: {
    address?: UPSAddress;
  };
}

interface UPSResponse {
  shipment?: UPSShipment;
}

interface UPSTestData {
  shipment: {
    package: {
      status: {
        description: string;
      };
      deliveryDate: {
        date: string;
      };
      activity: Array<{
        status: {
          description: string;
        };
        location: {
          address: {
            city: string;
            stateProvince: string;
          };
        };
        date: string;
      }>;
    };
  };
}

// Test data for development
const TEST_TRACKING_DATA: Record<string, UPSTestData> = {
  '1Z999AA10123456789': {
    shipment: {
      package: {
        status: {
          description: 'In Transit',
        },
        deliveryDate: {
          date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        },
        activity: [
          {
            status: {
              description: 'Package is in transit',
            },
            location: {
              address: {
                city: 'Louisville',
                stateProvince: 'KY',
              },
            },
            date: new Date().toISOString(),
          },
          {
            status: {
              description: 'Package received at UPS facility',
            },
            location: {
              address: {
                city: 'New York',
                stateProvince: 'NY',
              },
            },
            date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          },
        ],
      },
    },
  },
};

// Helper to parse UPS timestamp format 'YYYYMMDD HHMMSS' to ISO string
function parseUPSTimestamp(ts: string): string | null {
  if (!ts) return null;
  const match = ts.match(/^(\d{4})(\d{2})(\d{2})[ T]?(\d{2})(\d{2})(\d{2})$/);
  if (!match) return null;
  const [, year, month, day, hour, min, sec] = match;
  return `${year}-${month}-${day}T${hour}:${min}:${sec}`;
}

export class UPSCarrierService extends BaseCarrierService {
  constructor(config: CarrierConfig) {
    super(config);
  }

  async getTrackingInfo(trackingNumber: string): Promise<CarrierResponse> {
    try {
      // Check if we're in development mode and have test data
      if (process.env.NODE_ENV === 'development' && TEST_TRACKING_DATA[trackingNumber]) {
        console.log('🔧 Using test data for UPS tracking number:', trackingNumber);
        return {
          success: true,
          data: this.transformResponse(TEST_TRACKING_DATA[trackingNumber]),
        };
      }

      console.log('🚀 Making UPS API call for tracking number:', trackingNumber);
      
      // Call our Next.js API route instead of UPS directly
      const response = await fetch('/api/tracking/ups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trackingNumber }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ UPS API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        });
        throw new Error(`Failed to get UPS tracking information: ${response.statusText}`);
      }

      const { success, data, error } = await response.json();

      if (!success) {
        throw new Error(error || 'Failed to get UPS tracking information');
      }

      const transformed = this.transformResponse(data);
      if (
        !transformed ||
        !transformed.status ||
        transformed.status === 'Unknown' ||
        !transformed.events ||
        transformed.events.length === 0
      ) {
        return {
          success: false,
          error: { code: 'NO_DATA', message: 'No UPS tracking data found' }
        };
      }
      return {
        success: true,
        data: transformed,
      };
    } catch (error) {
      console.error('❌ UPS Service Error:', error);
      return this.handleApiError({
        code: 'UPS_SERVICE_ERROR',
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    }
  }

  protected transformResponse(data: UPSResponse | TrackingInfo): TrackingInfo {
    try {
      console.log('📦 Raw UPS Response:', JSON.stringify(data, null, 2));

      // Handle the case where we already have the transformed data
      if ('status' in data && 'location' in data && 'events' in data) {
        return data as TrackingInfo;
      }

      // Handle the actual UPS API response structure
      const shipment = data.shipment || {};
      const pkg = shipment.package || {};
      const activity = pkg.activity || [];

      // Sort activities by date (newest first)
      const sortedActivities = activity.sort((a: UPSActivity, b: UPSActivity) => {
        // Parse timestamps for comparison
        const aTime = parseUPSTimestamp((a.date || '') + (a.time ? ' ' + a.time : ''));
        const bTime = parseUPSTimestamp((b.date || '') + (b.time ? ' ' + b.time : ''));
        return new Date(bTime || 0).getTime() - new Date(aTime || 0).getTime();
      });

      // Get the most recent activity
      const latestActivity = sortedActivities[0] || {};
      const latestTimestamp = parseUPSTimestamp((latestActivity.date || '') + (latestActivity.time ? ' ' + latestActivity.time : '')) || '';

      const transformedData = {
        status: latestActivity.status?.description || 'Unknown',
        location: latestActivity.location?.address?.city + ', ' + latestActivity.location?.address?.stateProvinceCode || 'Unknown',
        estimatedDelivery: pkg.deliveryDate?.date,
        lastUpdate: latestTimestamp,
        events: sortedActivities.map((event: UPSActivity) => {
          const eventTimestamp = parseUPSTimestamp((event.date || '') + (event.time ? ' ' + event.time : '')) || '';
          return {
            status: event.status?.description || 'Unknown',
            location: event.location?.address?.city + ', ' + event.location?.address?.stateProvinceCode || 'Unknown',
            timestamp: eventTimestamp,
            description: event.status?.description || 'Unknown'
          };
        }),
        details: {
          service: pkg.service?.description,
          weight: pkg.weight?.value + ' ' + pkg.weight?.unitOfMeasurement?.code,
          dimensions: pkg.dimensions ? 
            `${pkg.dimensions.length} x ${pkg.dimensions.width} x ${pkg.dimensions.height} ${pkg.dimensions.unitOfMeasurement?.code}` : 
            undefined,
          origin: shipment.shipper?.address?.city + ', ' + shipment.shipper?.address?.stateProvinceCode,
          destination: shipment.shipTo?.address?.city + ', ' + shipment.shipTo?.address?.stateProvinceCode
        }
      };

      console.log('✅ Transformed Data:', JSON.stringify(transformedData, null, 2));
      return transformedData;
    } catch (error) {
      console.error('❌ Error transforming UPS response:', error);
      throw new Error('Failed to process UPS tracking data');
    }
  }
} 