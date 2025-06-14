'use client';

import { useState } from 'react';

export default function TextCleaner() {
  const [text, setText] = useState('');

  const cleanText = (type: string) => {
    switch (type) {
      case 'whitespace':
        return text.replace(/\s+/g, ' ').trim();
      case 'newlines':
        return text.replace(/\n+/g, '\n').trim();
      case 'duplicates':
        return text.replace(/(.)\1+/g, '$1');
      case 'special':
        return text.replace(/[^\w\s]/g, '');
      case 'numbers':
        return text.replace(/[0-9]/g, '');
      case 'urls':
        return text.replace(/https?:\/\/\S+/g, '');
      default:
        return text;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const cleaningOptions = [
    { name: 'whitespace', transform: cleanText },
    { name: 'newlines', transform: cleanText },
    { name: 'duplicates', transform: cleanText },
    { name: 'special', transform: cleanText },
    { name: 'numbers', transform: cleanText },
    { name: 'urls', transform: cleanText },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text here..."
            className="w-full h-48 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cleaningOptions.map((option) => (
              <div key={option.name} className="p-4 rounded-lg bg-white dark:bg-gray-700 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {option.name}
                  </h3>
                  <button
                    onClick={() => copyToClipboard(option.transform(text))}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    Copy
                  </button>
                </div>
                <div className="p-2 rounded bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white">
                  {option.transform(text)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 