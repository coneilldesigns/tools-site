import { toolSections } from '@/data/toolSections';
import ToolContent from '@/components/shared/ToolContent';
import { Metadata } from 'next';
import {
  // Unit Converters
  FeetToInches,
  CmToInches,
  MilesToKm,
  FahrenheitToCelsius,
  GramsToOunces,
  LitresToGallons,
  // Time & Date Tools
  TimeZoneConverter,
  CountdownTimer,
  AgeCalculator,
  DaysBetweenDates,
  WhatDayWasIt,
  UnixTimestampConverter,
  // Text & Writing Tools
  WordCounter,
  TextCaseConverter,
  TextCleaner,
  LoremIpsumGenerator,
  // Math & Number Tools
  TipCalculator,
  BmiCalculator,
  // Package & Shipping Tools
  UniversalTracking,
  // Design & Web Tools
  ColorPicker,
  BoxShadowGenerator,
  RegexTester,
  CssUnitsConverter,
  // Money & Currency Tools
  CurrencyConverter,
  CryptoConverter,
  CryptoChart,
} from '@/components/tools';
import Script from 'next/script';

const MediaNetAd = () => {
  return (
    <div id="media-net-ad" className="w-full">
      <Script id="media-net-init" strategy="afterInteractive">
        {`
          window._mNHandle = window._mNHandle || {};
          window._mNHandle.queue = window._mNHandle.queue || [];
          medianet_versionId = "3121199";
        `}
      </Script>
      <Script 
        src="//contextual.media.net/dmedianet.js?cid=YOUR_PUBLISHER_ID" 
        strategy="afterInteractive"
      />
      <div id="YOUR_AD_UNIT_ID"></div>
    </div>
  );
};

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ tool: string }> 
}): Promise<Metadata> {
  const { tool } = await params;
  const toolData = toolSections
    .flatMap(section => section.tools)
    .find(t => t.path === tool);

  if (!toolData) {
    return {
      title: 'Tool Not Found',
      description: 'The requested tool could not be found.'
    };
  }

  return {
    title: toolData.seo.title,
    description: toolData.seo.description,
    keywords: toolData.seo.keywords.join(', ')
  };
}

export default async function ToolPage({ 
  params 
}: { 
  params: Promise<{ tool: string }> 
}) {
  const { tool } = await params;
  const toolPath = tool;

  // Find the tool in our sections
  const toolData = toolSections
    .flatMap(section => section.tools)
    .find(t => t.path === toolPath);

  if (!toolData) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Tool Not Found</h1>
        <p className="text-gray-600">The requested tool could not be found.</p>
      </div>
    );
  }

  // Render the appropriate tool component based on the path
  const renderToolComponent = () => {
    switch (toolPath) {
      // Unit Converters
      case 'feet-to-inches':
        return <FeetToInches />;
      case 'cm-to-inches':
        return <CmToInches />;
      case 'miles-to-km':
        return <MilesToKm />;
      case 'fahrenheit-to-celsius':
        return <FahrenheitToCelsius />;
      case 'grams-to-ounces':
        return <GramsToOunces />;
      case 'litres-to-gallons':
        return <LitresToGallons />;
      // Time & Date Tools
      case 'time-zone-converter':
        return <TimeZoneConverter />;
      case 'countdown-timer':
        return <CountdownTimer />;
      case 'age-calculator':
        return <AgeCalculator />;
      case 'days-between-dates':
        return <DaysBetweenDates />;
      case 'what-day-was-it':
        return <WhatDayWasIt />;
      case 'unix-timestamp-converter':
        return <UnixTimestampConverter />;
      // Text & Writing Tools
      case 'word-counter':
        return <WordCounter />;
      case 'text-case-converter':
        return <TextCaseConverter />;
      case 'text-cleaner':
        return <TextCleaner />;
      case 'lorem-ipsum-generator':
        return <LoremIpsumGenerator />;
      // Math & Number Tools
      case 'tip-calculator':
        return <TipCalculator />;
      case 'bmi-calculator':
        return <BmiCalculator />;
      // Package & Shipping Tools
      case 'universal-tracking':
        return <UniversalTracking />;
      // Design & Web Tools
      case 'color-picker':
        return <ColorPicker />;
      case 'box-shadow-generator':
        return <BoxShadowGenerator />;
      case 'regex-tester':
        return <RegexTester />;
      case 'css-units-converter':
        return <CssUnitsConverter />;
      // Money & Currency Tools
      case 'currency-converter':
        return <CurrencyConverter />
      case 'crypto-converter':
        return <CryptoConverter />
      case 'crypto-chart':
        return <CryptoChart />
      default:
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400">
              {toolData.seo.description}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex flex-col m-0">
        <h1 className="text-3xl font-bold mb-2">{toolData.name}</h1>
        {toolData.content && toolData.content.length > 0 ? (
          <ToolContent content={toolData.content} />
        ) : (
          <ToolContent
            content={[
              {
                type: 'heading',
                text: `About ${toolData.name}`
              },
              {
                type: 'paragraph',
                text: toolData.seo.description
              },
              {
                type: 'heading',
                text: 'How to Use This Tool'
              },
              {
                type: 'paragraph',
                text: 'This tool is designed to be simple and intuitive. Follow the on-screen instructions to get started. If you have any questions or need assistance, please refer to the tool\'s interface for guidance.'
              },
              {
                type: 'heading',
                text: 'Features'
              },
              {
                type: 'paragraph',
                text: '• Easy-to-use interface\n• Instant results\n• Accurate calculations\n• Responsive design\n• Dark mode support'
              }
            ]}
          />
        )}
      </div>

      {renderToolComponent()}

      <div className="hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
        <MediaNetAd />
      </div>
    </div>
  );
} 