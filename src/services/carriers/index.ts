import { UPSCarrierService } from './ups';
import { FedExCarrierService } from './fedex';
import { DHLCarrierService } from './dhl';
import { CarrierResponse } from './types';
import { BaseCarrierService } from './base';

// Import other carrier services as they are implemented
// import { USPSCarrierService } from './usps';
// import { DHLCarrierService } from './dhl';

// Initialize carrier services with their configurations
export const carriers = {
  dhl: {
    name: 'DHL',
    pattern: /^[0-9]{10}$|^[A-Z]{3}-[A-Z]{2}-[0-9]{6}$|^[0-9]{11}$/,
    example: '1234567890',
    baseUrl: process.env.NODE_ENV === 'production'
      ? 'https://api.dhlecs.com'
      : 'https://api-sandbox.dhlecs.com',
    apiKey: process.env.DHL_API_KEY,
    apiSecret: process.env.DHL_API_SECRET,
  },
  fedex: {
    name: 'FedEx',
    pattern: /^[0-9]{12}$|^[0-9]{15}$/,
    example: '123456789012',
    baseUrl: process.env.NODE_ENV === 'production'
      ? 'https://apis.fedex.com'
      : 'https://apis-sandbox.fedex.com',
    apiKey: process.env.FEDEX_API_KEY,
    apiSecret: process.env.FEDEX_API_SECRET,
  },
  ups: {
    name: 'UPS',
    pattern: /^1Z[A-Z0-9]{16}$|^[0-9]{9}$|^T[0-9]{10}$/,
    example: '1Z999AA10123456789',
    baseUrl: process.env.NODE_ENV === 'production'
      ? 'https://onlinetools.ups.com'
      : 'https://wwwcie.ups.com',
    apiKey: process.env.UPS_API_KEY,
    apiSecret: process.env.UPS_API_SECRET,
  },
} as const;

export const carrierServices = {
  dhl: new DHLCarrierService(carriers.dhl),
  fedex: new FedExCarrierService(carriers.fedex),
  ups: new UPSCarrierService(carriers.ups),
} as const;

// Type for valid carrier IDs
export type CarrierId = keyof typeof carrierServices;

// Helper function to get carrier service by ID
export const getCarrierService = (carrierId: CarrierId) => {
  return carrierServices[carrierId];
};

// Helper function to validate tracking number format
export const validateTrackingNumber = (carrierId: CarrierId, trackingNumber: string): boolean => {
  const carrier = carriers[carrierId];
  return carrier.pattern.test(trackingNumber);
};

// Helper function to get carrier example tracking number
export const getCarrierExample = (carrierId: CarrierId): string => {
  return carriers[carrierId].example;
};

export function detectCarrier(trackingNumber: string): CarrierId | null {
  for (const [id, config] of Object.entries(carriers)) {
    if (config.pattern.test(trackingNumber)) {
      return id as CarrierId;
    }
  }
  return null;
}

export async function getTrackingInfo(trackingNumber: string): Promise<CarrierResponse & { carrier?: CarrierId }> {
  try {
    // Try all carrier services in parallel
    const carrierEntries = Object.entries(carrierServices) as [CarrierId, BaseCarrierService][];
    console.log(`🔍 Checking all carriers for tracking number: ${trackingNumber}`);
    const results = await Promise.all(
      carrierEntries.map(async ([carrierId, service]) => {
        try {
          const res = await service.getTrackingInfo(trackingNumber);
          console.log(`Carrier: ${carrierId}, Success: ${res.success}, Data:`, res.data);
          return { 
            success: res.success, 
            data: res.data ?? undefined, 
            error: res.error ?? undefined, 
            carrier: carrierId 
          };
        } catch (e) {
          console.log(`Carrier: ${carrierId}, Error:`, e);
          return { success: false, data: undefined, error: undefined, carrier: carrierId };
        }
      })
    );

    // Find all successful results
    const successfulResults = results.filter(r => r.success && r.data);

    if (successfulResults.length > 0) {
      // Prefer the carrier whose pattern matches the tracking number
      const preferred = successfulResults.find(r => {
        const carrierConfig = carriers[r.carrier!];
        return carrierConfig && carrierConfig.pattern.test(trackingNumber);
      });
      return preferred || successfulResults[0];
    }

    // If none succeeded, return a generic error
    return {
      success: false,
      error: {
        code: 'NO_CARRIER_FOUND',
        message: 'No carrier found for this tracking number or no data available.'
      }
    };
  } catch (error) {
    console.error('Error in getTrackingInfo:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      }
    };
  }
} 