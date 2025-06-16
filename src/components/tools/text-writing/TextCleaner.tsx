'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function TextCleaner() {
  const [text, setText] = useState('');

  const cleanText = (type: string) => {
    let result = text;
    switch (type) {
      case 'whitespace':
        result = text.replace(/\s+/g, ' ').trim();
        break;
      case 'newlines':
        result = text.replace(/\n+/g, '\n').trim();
        break;
      case 'duplicates':
        result = text.replace(/(.)\1+/g, '$1');
        break;
      case 'special':
        result = text.replace(/[^\w\s]/g, '');
        break;
      case 'numbers':
        result = text.replace(/[0-9]/g, '');
        break;
      case 'urls':
        result = text.replace(/https?:\/\/\S+/g, '');
        break;
    }
    setText(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
  };

  const cleaningOptions = [
    { name: 'whitespace', label: 'Remove Extra Spaces' },
    { name: 'newlines', label: 'Clean Newlines' },
    { name: 'duplicates', label: 'Remove Duplicates' },
    { name: 'special', label: 'Remove Special Characters' },
    { name: 'numbers', label: 'Remove Numbers' },
    { name: 'urls', label: 'Remove URLs' },
  ];

  return (
    <div className="flex flex-col w-full h-full m-0">
      {/* Text Input Area */}
      <div className="flex w-full flex-1 border-b border-gray-800">
        <div className="relative w-full h-full">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your text here..."
            className="w-full h-full px-6 py-4 bg-transparent text-white text-lg md:text-xl resize-none focus:outline-none"
          />
        </div>
      </div>

      {/* Cleaning Options */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4">
        {cleaningOptions.map((option) => (
          <motion.button
            key={option.name}
            onClick={() => cleanText(option.name)}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {option.label}
          </motion.button>
        ))}
        <motion.button
          onClick={copyToClipboard}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          Copy Text
        </motion.button>
      </div>
    </div>
  );
} 