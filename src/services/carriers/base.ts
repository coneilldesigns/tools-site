import { CarrierConfig, CarrierResponse, TrackingInfo } from './types';

interface ApiError {
  code?: string;
  message?: string;
  [key: string]: unknown;
}

export abstract class BaseCarrierService {
  protected config: CarrierConfig;

  constructor(config: CarrierConfig) {
    this.config = config;
  }

  abstract getTrackingInfo(trackingNumber: string): Promise<CarrierResponse>;

  protected async handleApiError(error: ApiError): Promise<CarrierResponse> {
    console.error(`Error in ${this.config.name} API:`, error);
    return {
      success: false,
      error: {
        code: error.code || 'UNKNOWN_ERROR',
        message: error.message || 'An unexpected error occurred',
      },
    };
  }

  protected abstract transformResponse(data: unknown): TrackingInfo;
} 