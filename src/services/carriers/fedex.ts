import { BaseCarrierService } from './base';
import { TrackingInfo, CarrierResponse, CarrierConfig } from './types';

interface FedExScanEvent {
  date: string;
  eventDescription?: string;
  scanLocation?: {
    city?: string;
    stateOrProvinceCode?: string;
  };
}

interface FedExWeight {
  value: string;
  unit: string;
}

interface FedExDimensions {
  length: string;
  width: string;
  height: string;
  units: string;
}

interface FedExWeightAndDimensions {
  weight?: FedExWeight[];
  dimensions?: FedExDimensions[];
}

interface FedExAddress {
  city?: string;
  stateOrProvinceCode?: string;
}

interface FedExPackageDetails {
  weightAndDimensions?: FedExWeightAndDimensions;
}

interface FedExLatestStatus {
  statusByLocale?: string;
  scanLocation?: FedExAddress;
  date?: string;
}

interface FedExTrackResult {
  latestStatusDetail?: FedExLatestStatus;
  scanEvents?: FedExScanEvent[];
  packageDetails?: FedExPackageDetails;
  estimatedDeliveryTimeWindow?: {
    window?: {
      ends?: string;
    };
  };
  serviceDetail?: {
    description?: string;
  };
  shipperInformation?: {
    address?: FedExAddress;
  };
  recipientInformation?: {
    address?: FedExAddress;
  };
}

interface FedExResponse {
  output?: {
    completeTrackResults?: Array<{
      trackResults?: FedExTrackResult[];
    }>;
  };
}

export class FedExCarrierService extends BaseCarrierService {
  constructor(config: CarrierConfig) {
    super(config);
  }

  async getTrackingInfo(trackingNumber: string): Promise<CarrierResponse> {
    try {
      // If running on the client, use the API route
      if (typeof window !== 'undefined') {
        const response = await fetch('/api/tracking/fedex', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ trackingNumber })
        });

        if (!response.ok) {
          const errorText = await response.text();
          return {
            success: false,
            error: {
              code: 'FEDEX_API_ERROR',
              message: errorText || 'Failed to get tracking information (client)'
            }
          };
        }

        const data = await response.json();
        if (!data.success) {
          return data;
        }

        // Transform the data before returning
        const transformedData = this.transformResponse(data.data);
        return {
          success: true,
          data: transformedData
        };
      }

      // If running on the server, use direct FedEx API calls
      try {
        // 1. Get OAuth token
        const tokenRes = await fetch(`${this.config.baseUrl}/oauth/token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: this.config.apiKey!,
            client_secret: this.config.apiSecret!,
          }),
        });
        if (!tokenRes.ok) {
          const error = await tokenRes.text();
          return {
            success: false,
            error: { code: 'FEDEX_OAUTH_ERROR', message: error }
          };
        }
        const { access_token } = await tokenRes.json();

        // 2. Call FedEx Track API
        const trackRes = await fetch(`${this.config.baseUrl}/track/v1/trackingnumbers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
            'X-locale': 'en_US',
          },
          body: JSON.stringify({
            includeDetailedScans: true,
            trackingInfo: [{
              trackingNumberInfo: { trackingNumber }
            }]
          }),
        });
        const data = await trackRes.json() as FedExResponse;
        if (!trackRes.ok) {
          return {
            success: false,
            error: { 
              code: 'FEDEX_TRACK_ERROR', 
              message: 'FedEx Track error'
            }
          };
        }

        // Transform the data before returning
        const transformedData = this.transformResponse(data);
        return {
          success: true,
          data: transformedData
        };
      } catch (error) {
        return {
          success: false,
          error: {
            code: 'FEDEX_SERVER_ERROR',
            message: error instanceof Error ? error.message : 'Failed to get tracking information (server)'
          }
        };
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'UNKNOWN_ERROR',
          message: error instanceof Error ? error.message : 'An unexpected error occurred'
        }
      };
    }
  }

  protected transformResponse(data: FedExResponse | TrackingInfo): TrackingInfo {
    try {
      console.log('📦 Raw FedEx Response:', JSON.stringify(data, null, 2));

      // Handle the case where we already have the transformed data
      if ('status' in data && 'location' in data && 'events' in data) {
        return data as TrackingInfo;
      }

      const trackResult = data.output?.completeTrackResults?.[0]?.trackResults?.[0];
      if (!trackResult) {
        throw new Error('Invalid FedEx tracking response structure');
      }

      const latestStatus = trackResult.latestStatusDetail || {};
      const scanEvents = trackResult.scanEvents || [];
      const packageDetails = trackResult.packageDetails || {};
      const weightAndDimensions = packageDetails.weightAndDimensions || {};

      // Sort events by date (newest first)
      const sortedEvents = scanEvents.sort((a: FedExScanEvent, b: FedExScanEvent) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      const transformedData = {
        status: latestStatus.statusByLocale || 'Unknown',
        location: latestStatus.scanLocation?.city + ', ' + latestStatus.scanLocation?.stateOrProvinceCode || 'Unknown',
        estimatedDelivery: trackResult.estimatedDeliveryTimeWindow?.window?.ends,
        lastUpdate: latestStatus.date || new Date().toISOString(),
        events: sortedEvents.map((event: FedExScanEvent) => ({
          status: event.eventDescription || 'Unknown',
          location: event.scanLocation?.city + ', ' + event.scanLocation?.stateOrProvinceCode || 'Unknown',
          timestamp: event.date,
          description: event.eventDescription || 'Unknown'
        })),
        details: {
          service: trackResult.serviceDetail?.description,
          weight: weightAndDimensions.weight?.[0]?.value + ' ' + weightAndDimensions.weight?.[0]?.unit,
          dimensions: weightAndDimensions.dimensions?.[0] ? 
            `${weightAndDimensions.dimensions[0].length} x ${weightAndDimensions.dimensions[0].width} x ${weightAndDimensions.dimensions[0].height} ${weightAndDimensions.dimensions[0].units}` : 
            undefined,
          origin: trackResult.shipperInformation?.address?.city + ', ' + trackResult.shipperInformation?.address?.stateOrProvinceCode,
          destination: trackResult.recipientInformation?.address?.city + ', ' + trackResult.recipientInformation?.address?.stateOrProvinceCode
        }
      };

      // Add debug logging
      console.log('Latest Status:', latestStatus);
      console.log('Scan Events:', scanEvents);
      console.log('Transformed Data:', transformedData);

      return transformedData;
    } catch (error) {
      console.error('❌ Error transforming FedEx response:', error);
      throw new Error('Failed to process FedEx tracking data');
    }
  }
} 