'use client';

import { useState } from 'react';

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
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="paragraphs" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Number of Paragraphs
              </label>
              <input
                type="number"
                id="paragraphs"
                value={paragraphs}
                onChange={(e) => setParagraphs(parseInt(e.target.value) || 0)}
                min="1"
                max="10"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white px-4 py-2"
              />
            </div>
            <div>
              <label htmlFor="wordsPerParagraph" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Words per Paragraph
              </label>
              <input
                type="number"
                id="wordsPerParagraph"
                value={words}
                onChange={(e) => setWords(parseInt(e.target.value) || 0)}
                min="10"
                max="200"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white px-4 py-2"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={generateLoremIpsum}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Generate
            </button>
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Copy
            </button>
          </div>

          {generatedText && (
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="whitespace-pre-wrap text-gray-900 dark:text-white">{generatedText}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 