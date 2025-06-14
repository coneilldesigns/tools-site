import { Metadata } from 'next';
import { SEOConfig } from '@/app/data/seoConfig';

interface SEOProps {
  config: SEOConfig;
  path?: string;
}

export function generateMetadata({ config, path = '' }: SEOProps): Metadata {
  const url = `https://tools-site.com${path}`;
  const title = config.title;
  const description = config.description;
  const keywords = config.keywords.join(', ');

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Tools Site',
      images: config.ogImage ? [
        {
          url: config.ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ] : undefined,
      type: config.ogType || 'website',
    },
    twitter: {
      card: config.twitterCard || 'summary_large_image',
      title,
      description,
      images: config.ogImage ? [config.ogImage] : undefined,
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
} 