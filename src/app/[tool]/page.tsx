import { toolSections } from '@/data/toolSections';
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
  TextToEmoji,
  FancyTextGenerator
} from '@/components/tools';

export default async function ToolPage({ params }: { params: Promise<{ tool: string }> }) {
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
      case 'text-to-emoji':
        return <TextToEmoji />;
      case 'fancy-text-generator':
        return <FancyTextGenerator />;
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
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between mb-0">
        <h1 className="text-3xl font-bold">{toolData.name}</h1>
      </div>

      {renderToolComponent()}

      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
        Google ads here
      </div>
    </div>
  );
} 