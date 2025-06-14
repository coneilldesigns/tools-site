import { generateMetadata } from '@/app/components/SEO';
import { toolSEO } from '@/app/data/seoConfig';
import TimeZoneConverter from './TimeZoneConverter';

export const metadata = generateMetadata({
  config: toolSEO['time-zone-converter'],
  path: '/tools/time-zone-converter'
});

export default function Page() {
  return <TimeZoneConverter />;
} 