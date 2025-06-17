import { CarrierConfig } from './types';

export const carriers: Record<string, CarrierConfig> = {
  ups: {
    name: 'UPS',
    pattern: /^(1Z[0-9A-Z]{16}|[0-9]{9}|T[0-9]{10})$/,
    example: '1Z999AA10123456789',
    apiKey: process.env.NEXT_PUBLIC_UPS_CLIENT_ID,
    apiSecret: process.env.NEXT_PUBLIC_UPS_CLIENT_SECRET,
    baseUrl: process.env.NODE_ENV === 'production' 
      ? 'https://api.ups.com' 
      : 'https://wwwcie.ups.com',
    billingAccountNumber: '0CC583',
    appName: 'Everyday Tools',
    environment: process.env.NODE_ENV === 'production' ? 'production' : 'testing'
  },
  fedex: {
    name: 'FedEx',
    pattern: /^[0-9]{12}$|^[0-9]{15}$|^[0-9]{22}$/,
    example: '123456789012',
    apiKey: process.env.NEXT_PUBLIC_FEDEX_API_KEY,
    apiSecret: process.env.NEXT_PUBLIC_FEDEX_SECRET_KEY,
    baseUrl: process.env.NODE_ENV === 'production'
      ? 'https://apis.fedex.com'
      : 'https://apis-sandbox.fedex.com'
  },
  USPS: {
    name: 'USPS',
    pattern: /^(94|95|96|97|98|99)[0-9]{20}$|^[A-Z]{2}[0-9]{9}[A-Z]{2}$|^[0-9]{20}$/,
    example: '9400100897654321',
    baseUrl: 'https://secure.shippingapis.com/ShippingAPI.dll',
    apiKey: process.env.NEXT_PUBLIC_USPS_USER_ID,
  },
  DHL: {
    name: 'DHL',
    pattern: /^[0-9]{10}$|^[0-9]{11}$|^[0-9]{12}$/,
    example: '1234567890',
    baseUrl: 'https://api-test.dhl.com/parcel/de/shipping/v2',
    apiKey: process.env.NEXT_PUBLIC_DHL_API_KEY,
  },
}; 