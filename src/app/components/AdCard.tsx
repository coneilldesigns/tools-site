'use client';

import { useEffect, useRef } from 'react';

interface AdCardProps {
  slot: string;
  format?: 'horizontal' | 'vertical';
  style?: React.CSSProperties;
}

export default function AdCard({ slot, format = 'horizontal', style }: AdCardProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!adRef.current || isInitialized.current) return;

    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      isInitialized.current = true;
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className="w-full flex justify-center my-4">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: 'block',
          ...(format === 'vertical' ? { width: '160px', height: '600px' } : { width: '100%', height: '90px' }),
          ...style
        }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
} 