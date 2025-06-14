'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ToolLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const toolSections = [
  {
    icon: "🔢",
    title: "Unit & Measurement Converters",
    tools: [
      { name: "Feet ⇄ Inches", path: "feet-to-inches" },
      { name: "CM ⇄ Inches", path: "cm-to-inches" },
      { name: "Miles ⇄ KM", path: "miles-to-km" },
      { name: "Fahrenheit ⇄ Celsius", path: "fahrenheit-to-celsius" },
      { name: "Grams ⇄ Ounces", path: "grams-to-ounces" },
      { name: "Litres ⇄ Gallons", path: "litres-to-gallons" }
    ]
  },
  {
    icon: "⏰",
    title: "Time & Date Tools",
    tools: [
      { name: "Time zone converter", path: "time-zone-converter" },
      { name: "Countdown timer", path: "countdown-timer" },
      { name: "Age calculator", path: "age-calculator" },
      { name: "Days between dates", path: "days-between-dates" },
      { name: "What day was it?", path: "what-day-was-it" },
      { name: "Unix timestamp converter", path: "unix-timestamp-converter" }
    ]
  },
  {
    icon: "🔤",
    title: "Text & Writing Tools",
    tools: [
      { name: "Word/character counter", path: "word-counter" },
      { name: "Text case converter", path: "text-case-converter" },
      { name: "Remove line breaks / extra spaces", path: "text-cleaner" },
      { name: "Lorem Ipsum generator", path: "lorem-ipsum-generator" },
      { name: "Text to emoji translator", path: "text-to-emoji" },
      { name: "Fancy text generator", path: "fancy-text-generator" }
    ]
  },
  {
    icon: "🧮",
    title: "Math & Number Tools",
    tools: [
      { name: "Tip calculator", path: "tip-calculator" },
      { name: "Percentage calculator", path: "percentage-calculator" },
      { name: "Loan / mortgage calculator", path: "loan-calculator" },
      { name: "Random number generator", path: "random-number-generator" },
      { name: "GPA calculator", path: "gpa-calculator" },
      { name: "BMI calculator", path: "bmi-calculator" },
      { name: "Prime number checker", path: "prime-number-checker" }
    ]
  },
  {
    icon: "💼",
    title: "Business & Productivity Tools",
    tools: [
      { name: "Invoice generator", path: "invoice-generator" },
      { name: "Meeting scheduler", path: "meeting-scheduler" },
      { name: "QR code generator", path: "qr-code-generator" },
      { name: "Barcode generator", path: "barcode-generator" },
      { name: "Email signature generator", path: "email-signature-generator" },
      { name: "Resume builder", path: "resume-builder" }
    ]
  },
  {
    icon: "📐",
    title: "Design & Web Tools",
    tools: [
      { name: "Color picker / converter", path: "color-picker" },
      { name: "Image resizer / compressor", path: "image-resizer" },
      { name: "Font pairing tool", path: "font-pairing" },
      { name: "Favicon generator", path: "favicon-generator" },
      { name: "CSS box shadow generator", path: "box-shadow-generator" },
      { name: "HTML table generator", path: "table-generator" }
    ]
  },
  {
    icon: "📚",
    title: "Language & Learning Tools",
    tools: [
      { name: "Reading time estimator", path: "reading-time-estimator" },
      { name: "Number to words", path: "number-to-words" },
      { name: "Spelling checker", path: "spelling-checker" },
      { name: "Roman numerals converter", path: "roman-numerals" },
      { name: "Morse code translator", path: "morse-code" }
    ]
  },
  {
    icon: "🔐",
    title: "Privacy & Security Tools",
    tools: [
      { name: "Password generator", path: "password-generator" },
      { name: "Password strength checker", path: "password-strength" },
      { name: "Base64 encode/decode", path: "base64" },
      { name: "URL encoder/decoder", path: "url-encoder" },
      { name: "Text encrypt/decrypt", path: "text-encrypt" }
    ]
  },
  {
    icon: "🔄",
    title: "Fun & Random Tools",
    tools: [
      { name: "Coin flipper", path: "coin-flipper" },
      { name: "Dice roller", path: "dice-roller" },
      { name: "Would-you-rather question generator", path: "would-you-rather" },
      { name: "Truth or Dare tool", path: "truth-or-dare" },
      { name: "Random name picker", path: "random-name-picker" }
    ]
  }
];

export default function ToolLayout({ children, title, description }: ToolLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
              Tools Site
            </Link>
            <nav className="flex gap-4">
              <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Home
              </Link>
              <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-900 shadow-sm h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
          <nav className="p-4">
            {toolSections.map((section, index) => (
              <div key={index} className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span>{section.icon}</span>
                  {section.title}
                </h3>
                <ul className="space-y-1">
                  {section.tools.map((tool) => (
                    <li key={tool.path}>
                      <Link
                        href={`/tools/${tool.path}`}
                        className={`block px-3 py-2 rounded-md text-sm ${
                          pathname === `/tools/${tool.path}`
                            ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        {tool.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
                {description && (
                  <p className="mt-2 text-gray-600 dark:text-gray-300">{description}</p>
                )}
              </div>
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © 2024 Tools Site. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 