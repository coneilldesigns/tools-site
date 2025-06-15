'use client';

import { useEffect } from 'react';
import Image from 'next/image';

interface AdData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
}

interface AdSenseConfig {
  'data-ad-client': string;
  'data-ad-slot': string;
  'data-ad-format': string;
  'data-full-width-responsive': string;
}

declare global {
  interface Window {
    adsbygoogle: AdSenseConfig[];
  }
}

export default function Ads({ data }: { data: AdData[] }) {
  useEffect(() => {
    try {
      // Initialize AdSense
      const adsbygoogle = window.adsbygoogle || [];
      adsbygoogle.push({
        'data-ad-client': 'ca-pub-YOUR_PUBLISHER_ID',
        'data-ad-slot': 'YOUR_AD_SLOT',
        'data-ad-format': 'auto',
        'data-full-width-responsive': 'true'
      });
      window.adsbygoogle = adsbygoogle;
    } catch (err) {
      console.error('Error loading ads:', err);
    }
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((ad) => (
        <div key={ad.id} className="bg-gray-800 rounded-lg p-4">
          <div className="relative w-full h-48">
            <Image
              src={ad.imageUrl}
              alt={ad.title}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <h3 className="text-xl font-bold mt-2">{ad.title}</h3>
          <p className="text-gray-400 mt-1">{ad.description}</p>
          <a href={ad.link} className="text-blue-500 hover:text-blue-400 mt-2 inline-block">
            Learn More
          </a>
        </div>
      ))}
    </div>
  );
} 