import { SEOConfig } from './types';

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
}

export const defaultSEO: SEOConfig = {
  title: 'Tools Site - Free Online Tools',
  description: 'A collection of free online tools for everyday use. Convert units, calculate time zones, and more.',
  keywords: ['online tools', 'unit converter', 'calculator', 'free tools'],
  ogType: 'website',
  twitterCard: 'summary_large_image'
};

export const toolSEO: Record<string, SEOConfig> = {
  'feet-to-inches': {
    title: 'Feet to Inches Converter - Free Online Tool',
    description: 'Convert feet to inches easily with our free online converter. Quick, accurate, and easy to use.',
    keywords: ['feet to inches', 'length converter', 'unit conversion', 'measurement'],
    ogType: 'website'
  },
  'cm-to-inches': {
    title: 'CM to Inches Converter - Free Online Tool',
    description: 'Convert centimeters to inches easily with our free online converter. Quick, accurate, and easy to use.',
    keywords: ['cm to inches', 'centimeter to inch', 'length converter', 'metric to imperial'],
    ogType: 'website'
  },
  'miles-to-km': {
    title: 'Miles to Kilometers Converter - Free Online Tool',
    description: 'Convert miles to kilometers easily with our free online converter. Quick, accurate, and easy to use.',
    keywords: ['miles to km', 'distance converter', 'unit conversion', 'imperial to metric'],
    ogType: 'website'
  },
  'fahrenheit-to-celsius': {
    title: 'Fahrenheit to Celsius Converter - Free Online Tool',
    description: 'Convert Fahrenheit to Celsius easily with our free online converter. Quick, accurate, and easy to use.',
    keywords: ['fahrenheit to celsius', 'temperature converter', 'unit conversion', 'weather'],
    ogType: 'website'
  },
  'grams-to-ounces': {
    title: 'Grams to Ounces Converter - Free Online Tool',
    description: 'Convert grams to ounces easily with our free online converter. Quick, accurate, and easy to use.',
    keywords: ['grams to ounces', 'weight converter', 'unit conversion', 'metric to imperial'],
    ogType: 'website'
  },
  'litres-to-gallons': {
    title: 'Liters to Gallons Converter - Free Online Tool',
    description: 'Convert liters to gallons easily with our free online converter. Quick, accurate, and easy to use.',
    keywords: ['liters to gallons', 'volume converter', 'unit conversion', 'metric to imperial'],
    ogType: 'website'
  },
  'time-zone-converter': {
    title: 'Time Zone Converter - Free Online Tool',
    description: 'Convert times between different time zones easily with our free online converter. Quick, accurate, and easy to use.',
    keywords: ['time zone converter', 'time conversion', 'world clock', 'time difference'],
    ogType: 'website'
  }
}; 