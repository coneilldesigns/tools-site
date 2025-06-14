'use client';

import { useState, useEffect } from 'react';

export default function WordCounter() {
  const [text, setText] = useState('');
  const [stats, setStats] = useState({
    words: 0,
    characters: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
  });

  useEffect(() => {
    const calculateStats = () => {
      const trimmedText = text.trim();
      const words = trimmedText ? trimmedText.split(/\s+/).length : 0;
      const characters = trimmedText.length;
      const sentences = trimmedText ? trimmedText.split(/[.!?]+/).filter(Boolean).length : 0;
      const paragraphs = trimmedText ? trimmedText.split(/\n\s*\n/).filter(Boolean).length : 0;
      const readingTime = Math.ceil(words / 200); // Average reading speed: 200 words per minute

      setStats({
        words,
        characters,
        sentences,
        paragraphs,
        readingTime,
      });
    };

    calculateStats();
  }, [text]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here..."
          className="w-full h-48 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-lg bg-white dark:bg-gray-700 shadow-sm">
          <div className="text-sm text-gray-500 dark:text-gray-400">Words</div>
          <div className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.words}</div>
        </div>
        <div className="p-4 rounded-lg bg-white dark:bg-gray-700 shadow-sm">
          <div className="text-sm text-gray-500 dark:text-gray-400">Characters</div>
          <div className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.characters}</div>
        </div>
        <div className="p-4 rounded-lg bg-white dark:bg-gray-700 shadow-sm">
          <div className="text-sm text-gray-500 dark:text-gray-400">Sentences</div>
          <div className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.sentences}</div>
        </div>
        <div className="p-4 rounded-lg bg-white dark:bg-gray-700 shadow-sm">
          <div className="text-sm text-gray-500 dark:text-gray-400">Paragraphs</div>
          <div className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.paragraphs}</div>
        </div>
        <div className="p-4 rounded-lg bg-white dark:bg-gray-700 shadow-sm">
          <div className="text-sm text-gray-500 dark:text-gray-400">Reading Time</div>
          <div className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.readingTime} min</div>
        </div>
      </div>
    </div>
  );
} 