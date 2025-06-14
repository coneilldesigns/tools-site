import { generateMetadata } from '@/app/components/SEO';
import { toolSEO } from '@/app/data/seoConfig';
import MilesToKm from './MilesToKm';

export const metadata = generateMetadata({
  config: toolSEO['miles-to-km'],
  path: '/tools/miles-to-km'
});

export default function Page() {
  return <MilesToKm />;
} 