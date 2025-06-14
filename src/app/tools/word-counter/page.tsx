'use client';

import { useState, useEffect } from 'react';
import ToolLayout from '@/app/components/ToolLayout';

export default function WordCounter() {
  const [text, setText] = useState('');
  const [stats, setStats] = useState({
    characters: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0
  });

  useEffect(() => {
    const calculateStats = () => {
      const characters = text.length;
      const words = text.trim() ? text.trim().split(/\s+/) : [];
      const sentences = text.trim() ? text.split(/[.!?]+/).filter(Boolean) : [];
      const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(Boolean) : [];
      
      // Average reading speed: 200 words per minute
      const readingTime = Math.ceil(words.length / 200);

      setStats({
        characters,
        words: words.length,
        sentences: sentences.length,
        paragraphs: paragraphs.length,
        readingTime
      });
    };

    calculateStats();
  }, [text]);

  return (
    <ToolLayout 
      title="Word Counter"
      description="Count words, characters, sentences, and paragraphs in your text. Get an estimate of reading time based on average reading speed."
    >
      <div className="space-y-6">
        <div>
          <label htmlFor="text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Enter your text
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            placeholder="Type or paste your text here..."
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Characters</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.characters}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Words</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.words}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Sentences</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.sentences}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Paragraphs</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.paragraphs}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Reading Time</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.readingTime} min</p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">How to use</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Simply type or paste your text into the textarea above. The statistics will update automatically.
            Reading time is calculated based on an average reading speed of 200 words per minute.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
} 