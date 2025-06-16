'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

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
    <div className="flex flex-col w-full h-full m-0">
      {/* Text Input Area */}
      <div className="flex w-full flex-1 border-b border-gray-800">
        <div className="relative w-full h-full">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text here..."
            className="w-full h-full px-6 py-4 bg-transparent text-white text-lg md:text-xl resize-none focus:outline-none"
          />
        </div>
      </div>

      {/* Converted Text Display Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full flex-1">
        {['upper', 'lower', 'title', 'sentence', 'alternating'].map((type) => (
          <div 
            key={type} 
            className="relative h-full flex flex-col border-r border-b md:border-b-0 border-gray-800"
          >
            <motion.div 
              className="w-full h-full flex flex-col"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
                <div className="text-gray-300 text-base md:text-xl lg:text-2xl capitalize">
                  {type} Case
                </div>
                <button
                  onClick={() => copyToClipboard(convertCase(type))}
                  className="text-emerald-500 hover:text-emerald-400 text-sm md:text-base font-medium"
                >
                  Copy
                </button>
              </div>
              <div className="flex-1 p-6 text-white text-lg md:text-xl overflow-auto">
                {convertCase(type)}
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
} 