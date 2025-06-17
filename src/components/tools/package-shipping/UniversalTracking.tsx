'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getTrackingInfo } from '@/services/carriers';
import type { TrackingInfo } from '@/services/carriers/types';
import Image from 'next/image';

interface CarrierInfo {
  name: string;
  pattern: RegExp;
  example: string;
  logo: string;
}

const CARRIERS: CarrierInfo[] = [
  {
    name: 'UPS',
    pattern: /^(1Z[0-9A-Z]{16}|[0-9]{9}|T[0-9]{10})$/,
    example: '1Z999AA10123456789',
    logo: '/images/carriers/ups-logo.png'
  },
  {
    name: 'FedEx',
    pattern: /^[0-9]{12}$|^[0-9]{15}$|^[0-9]{22}$/,
    example: '123456789012',
    logo: '/images/carriers/fedex-logo.png'
  },
  {
    name: 'USPS',
    pattern: /^(94|95|96|97|98|99)[0-9]{20}$|^[A-Z]{2}[0-9]{9}[A-Z]{2}$|^[0-9]{20}$/,
    example: '9400100897654321',
    logo: '/images/carriers/usps-logo.png'
  },
  {
    name: 'DHL',
    pattern: /^[0-9]{10}$|^[A-Z]{3}-[A-Z]{2}-[0-9]{6}$|^[0-9]{11}$/,
    example: '1234567890',
    logo: '/images/carriers/dhl-logo.png'
  }
];

export default function UniversalTracking() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [textSize, setTextSize] = useState<string>('4vw');
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [detectedCarrier, setDetectedCarrier] = useState<CarrierInfo | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const length = trackingNumber.length;
    const sizes = isMobile 
      ? { long: '5vw', medium: '6vw', short: '7vw', default: '8vw' }
      : { long: '3vw', medium: '3.5vw', short: '4vw', default: '4.5vw' };
    
    setTextSize(
      length > 8 ? sizes.long :
      length > 6 ? sizes.medium :
      length > 4 ? sizes.short :
      sizes.default
    );
  }, [trackingNumber, isMobile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTrackingInfo(null);

    try {
      const response = await getTrackingInfo(trackingNumber);
      if (response.success && response.data) {
        setTrackingInfo(response.data);
        const carrierInfo = CARRIERS.find(c => c.name.toLowerCase() === response.carrier);
        setDetectedCarrier(carrierInfo || null);
      } else {
        setError(response.error?.message || 'Failed to get tracking information');
        setDetectedCarrier(null);
      }
    } catch {
      setError('An unexpected error occurred');
      setDetectedCarrier(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full m-0">
      {/* Input Area */}
      <form onSubmit={handleSubmit} className="flex w-full flex-1 border-b border-gray-800 min-h-[300px]">
        <div className="relative w-full h-full flex items-center justify-center">
          <motion.div 
            className="w-full h-full flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="relative h-full">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
                className="w-full h-full font-bold text-center bg-transparent border-none focus:ring-0 focus:outline-none text-white placeholder-gray-600 overflow-hidden"
                style={{ fontSize: textSize }}
              />
              <motion.div 
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-sm md:text-base font-medium text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Tracking Number
              </motion.div>
            </div>
          </motion.div>
        </div>
      </form>

      {/* Results Area */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-4 p-4">
        {loading && (
          <motion.div 
            className="text-gray-400 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Fetching tracking information...
          </motion.div>
        )}

        {error && (
          <motion.div 
            className="text-red-400 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        {trackingInfo && (
          <motion.div 
            className="w-full max-w-2xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-gray-800 rounded-lg p-6 space-y-4">
              {/* Carrier Logo and Status */}
              <div className="flex items-center justify-between mb-4">
                {detectedCarrier && (
                  <div className="relative w-24 h-12">
                    <Image
                      src={detectedCarrier.logo}
                      alt={`${detectedCarrier.name} logo`}
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                )}
                <div className="text-white text-xl font-bold">
                  Status: {trackingInfo.status}
                </div>
              </div>

              {/* Rest of the tracking info display */}
              {trackingInfo.estimatedDelivery && (
                <div className="text-gray-400">
                  Est. Delivery: {new Date(trackingInfo.estimatedDelivery).toLocaleDateString()}
                </div>
              )}
              
              {/* Location and Last Update */}
              <div className="text-gray-300">
                Current Location: {trackingInfo.location}
              </div>
              {trackingInfo.lastUpdate && (
                <div className="text-gray-400 text-sm">
                  Last Update: {new Date(trackingInfo.lastUpdate).toLocaleString()}
                </div>
              )}

              {/* Package Details */}
              {trackingInfo.details && (
                <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                  <div className="text-white font-bold mb-2">Package Details</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {trackingInfo.details.service && (
                      <div className="text-gray-300">Service: {trackingInfo.details.service}</div>
                    )}
                    {trackingInfo.details.weight && (
                      <div className="text-gray-300">Weight: {trackingInfo.details.weight}</div>
                    )}
                    {trackingInfo.details.dimensions && (
                      <div className="text-gray-300">Dimensions: {trackingInfo.details.dimensions}</div>
                    )}
                    {trackingInfo.details.origin && (
                      <div className="text-gray-300">From: {trackingInfo.details.origin}</div>
                    )}
                    {trackingInfo.details.destination && (
                      <div className="text-gray-300">To: {trackingInfo.details.destination}</div>
                    )}
                  </div>
                </div>
              )}

              {/* Tracking History */}
              <div className="mt-6 space-y-4">
                <div className="text-white font-bold">Tracking History</div>
                {trackingInfo.events && trackingInfo.events.length > 0 ? (
                  trackingInfo.events.map((event, index) => (
                    <div key={index} className="border-l-2 border-gray-700 pl-4 py-2">
                      <div className="text-gray-300">{event.status}</div>
                      <div className="text-gray-400 text-sm">{event.location}</div>
                      <div className="text-gray-500 text-xs">
                        {new Date(event.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-sm">No tracking history available</div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {!trackingInfo && !error && !loading && (
          <motion.div 
            className="text-gray-400 text-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            Enter a tracking number to see results
          </motion.div>
        )}
      </div>
    </div>
  );
}
