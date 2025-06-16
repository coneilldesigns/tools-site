'use client';

import { motion } from 'framer-motion';

interface ToolContentProps {
  content: {
    type: 'heading' | 'paragraph';
    text: string;
  }[];
}

export default function ToolContent({ content }: ToolContentProps) {
  return (
    <details className="text-gray-300">
      <summary className="cursor-pointer hover:text-white transition-colors">
        <span className="text-sm md:text-lg font-medium">About this tool</span>
      </summary>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-4 space-y-4"
      >
        {content.map((item, index) => (
          <div key={index}>
            {item.type === 'heading' ? (
              <h3 className="text-xl font-semibold text-white mb-2">{item.text}</h3>
            ) : (
              <p className="text-gray-300 leading-relaxed">{item.text}</p>
            )}
          </div>
        ))}
      </motion.div>
    </details>
  );
} 