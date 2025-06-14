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

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="space-y-4">
          <div>
            <label htmlFor="text" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Enter your text
            </label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white px-4 py-2 min-h-[100px]"
              placeholder="Type or paste your text here..."
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Available Emojis:
            </h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(emojiMap).map(([word, emoji]) => (
                <div key={word} className="flex items-center bg-white dark:bg-gray-800 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-600">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{word}</span>
                  <span className="ml-2">{emoji}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={translateToEmoji}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Translate to Emoji
          </button>

          {emojiText && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Translated Text
                </label>
                <button
                  onClick={copyToClipboard}
                  className="text-sm text-blue-500 hover:text-blue-600 focus:outline-none"
                >
                  Copy to clipboard
                </button>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{emojiText}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 