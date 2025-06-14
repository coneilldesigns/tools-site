'use client';

import { useEffect, useState } from 'react';
import AdCard from './AdCard';
import DevAdCard from './DevAdCard';

interface AdWrapperProps {
  slot: string;
  format?: 'horizontal' | 'vertical';
  style?: React.CSSProperties;
}

export default function AdWrapper({ slot, format, style }: AdWrapperProps) {
  const [isProduction, setIsProduction] = useState(false);

  useEffect(() => {
    // Check if we're in production
    setIsProduction(process.env.NODE_ENV === 'production');
  }, []);

  if (isProduction) {
    return <AdCard slot={slot} format={format} style={style} />;
  }

  return <DevAdCard slot={slot} format={format} style={style} />;
} 