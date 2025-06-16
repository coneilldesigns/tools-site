'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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

      {/* Stats Display Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 w-full flex-1">
        <div className="relative h-full flex flex-col items-center justify-center border-r border-b md:border-b-0 border-gray-800">
          <motion.div 
            className="w-full h-full flex flex-col items-center justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="text-gray-300 text-base md:text-xl lg:text-2xl">Words</div>
            <div className="text-white text-3xl md:text-5xl lg:text-6xl font-bold">{stats.words}</div>
          </motion.div>
        </div>
        <div className="relative h-full flex flex-col items-center justify-center border-r border-b md:border-b-0 border-gray-800">
          <motion.div 
            className="w-full h-full flex flex-col items-center justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="text-gray-300 text-base md:text-xl lg:text-2xl">Characters</div>
            <div className="text-white text-3xl md:text-5xl lg:text-6xl font-bold">{stats.characters}</div>
          </motion.div>
        </div>
        <div className="relative h-full flex flex-col items-center justify-center border-r border-b md:border-b-0 border-gray-800">
          <motion.div 
            className="w-full h-full flex flex-col items-center justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="text-gray-300 text-base md:text-xl lg:text-2xl">Sentences</div>
            <div className="text-white text-3xl md:text-5xl lg:text-6xl font-bold">{stats.sentences}</div>
          </motion.div>
        </div>
        <div className="relative h-full flex flex-col items-center justify-center border-r border-b md:border-b-0 border-gray-800">
          <motion.div 
            className="w-full h-full flex flex-col items-center justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="text-gray-300 text-base md:text-xl lg:text-2xl">Paragraphs</div>
            <div className="text-white text-3xl md:text-5xl lg:text-6xl font-bold">{stats.paragraphs}</div>
          </motion.div>
        </div>
        <div className="relative h-full flex flex-col items-center justify-center">
          <motion.div 
            className="w-full h-full flex flex-col items-center justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="text-gray-300 text-base md:text-xl lg:text-2xl">Reading Time</div>
            <div className="text-white text-3xl md:text-5xl lg:text-6xl font-bold">{stats.readingTime}m</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 