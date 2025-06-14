'use client';

import { useState } from 'react';

export default function TextCaseConverter() {
  const [text, setText] = useState('');

  const convertCase = (type: string) => {
    switch (type) {
      case 'upper':
        return text.toUpperCase();
      case 'lower':
        return text.toLowerCase();
      case 'title':
        return text
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      case 'sentence':
        return text
          .toLowerCase()
          .replace(/(^\w|\.\s+\w)/g, letter => letter.toUpperCase());
      case 'alternating':
        return text
          .split('')
          .map((char, index) => index % 2 === 0 ? char.toLowerCase() : char.toUpperCase())
          .join('');
      default:
        return text;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text here..."
          className="w-full h-48 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {['upper', 'lower', 'title', 'sentence', 'alternating'].map((type) => (
          <div key={type} className="p-4 rounded-lg bg-white dark:bg-gray-700 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                {type} Case
              </h3>
              <button
                onClick={() => copyToClipboard(convertCase(type))}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                Copy
              </button>
            </div>
            <div className="p-2 rounded bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white">
              {convertCase(type)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 