'use client';

import { useState } from 'react';

export default function TextToEmoji() {
  const [text, setText] = useState('');
  const [emojiText, setEmojiText] = useState('');

  // Simple emoji mapping for common words
  const emojiMap: { [key: string]: string } = {
    'happy': '😊',
    'love': '❤️',
    'sad': '😢',
    'angry': '😠',
    'laugh': '😂'
  };

  const translateToEmoji = () => {
    let result = text.toLowerCase();
    
    // Replace words with emojis
    Object.entries(emojiMap).forEach(([word, emoji]) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      result = result.replace(regex, emoji);
    });

    setEmojiText(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(emojiText);
  };

  const emojiStyles = [
    { name: 'Original Text', transform: (text: string) => text },
    { name: 'Emoji Text', transform: () => emojiText },
    { name: 'Simple Emoji Mapping', transform: (text: string) => {
      let result = text.toLowerCase();
      Object.entries(emojiMap).forEach(([word, emoji]) => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        result = result.replace(regex, emoji);
      });
      return result;
    } },
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
            {emojiStyles.map((style) => (
              <div key={style.name} className="p-4 rounded-lg bg-white dark:bg-gray-700 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {style.name}
                  </h3>
                  <button
                    onClick={() => copyToClipboard(style.transform(text))}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    Copy
                  </button>
                </div>
                <div className="p-2 rounded bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white">
                  {style.transform(text)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 