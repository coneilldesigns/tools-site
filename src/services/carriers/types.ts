export interface PackageDetails {
  service?: string;
  weight?: string;
  dimensions?: string;
  origin?: string;
  destination?: string;
}

export interface TrackingInfo {
  status: string;
  location: string;
  estimatedDelivery?: string;
  lastUpdate: string;
  events: TrackingEvent[];
  details?: PackageDetails;
}

export interface TrackingEvent {
  status: string;
  location: string;
  timestamp: string;
  description: string;
}

export interface CarrierConfig {
  name: string;
  pattern: RegExp;
  example: string;
  apiKey?: string;
  apiSecret?: string;
  baseUrl: string;
  // UPS-specific fields
  billingAccountNumber?: string;
  appName?: string;
  environment?: 'production' | 'testing';
}

export interface CarrierResponse {
  success: boolean;
  data?: TrackingInfo;
  error?: {
    code: string;
    message: string;
  };
} 