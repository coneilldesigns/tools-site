'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const loremWords = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation',
  'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat'
];

export default function LoremIpsumGenerator() {
  const [paragraphs, setParagraphs] = useState(3);
  const [words, setWords] = useState(50);
  const [generatedText, setGeneratedText] = useState('');

  const generateLoremIpsum = () => {
    const result = [];
    for (let i = 0; i < paragraphs; i++) {
      const paragraph = [];
      for (let j = 0; j < words; j++) {
        const randomIndex = Math.floor(Math.random() * loremWords.length);
        paragraph.push(loremWords[randomIndex]);
      }
      result.push(paragraph.join(' '));
    }
    setGeneratedText(result.join('\n\n'));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
  };

  return (
    <div className="flex flex-col w-full h-full m-0">
      {/* Controls Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border-b border-gray-800">
        <div>
          <label htmlFor="paragraphs" className="block text-sm font-medium text-gray-300 mb-2">
            Number of Paragraphs
          </label>
          <input
            type="number"
            id="paragraphs"
            value={paragraphs}
            onChange={(e) => setParagraphs(parseInt(e.target.value) || 0)}
            min="1"
            max="10"
            className="w-full rounded-lg bg-gray-800 border-gray-700 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="wordsPerParagraph" className="block text-sm font-medium text-gray-300 mb-2">
            Words per Paragraph
          </label>
          <input
            type="number"
            id="wordsPerParagraph"
            value={words}
            onChange={(e) => setWords(parseInt(e.target.value) || 0)}
            min="10"
            max="200"
            className="w-full rounded-lg bg-gray-800 border-gray-700 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 p-4 border-b border-gray-800">
        <motion.button
          onClick={generateLoremIpsum}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          Generate
        </motion.button>
        <motion.button
          onClick={copyToClipboard}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          Copy
        </motion.button>
      </div>

      {/* Generated Text Area */}
      <div className="flex-1 p-4">
        <div className="w-full h-full">
          <textarea
            value={generatedText}
            readOnly
            placeholder="Generated text will appear here..."
            className="w-full h-full px-6 py-4 bg-transparent text-white text-lg md:text-xl resize-none focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
} 