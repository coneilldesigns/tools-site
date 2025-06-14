'use client';

import { useState } from 'react';

const fancyStyles = {
  'bubble': 'Ⓑⓤⓑⓑⓛⓔ',
  'double': '𝔻𝕠𝕦𝕓𝕝𝕖',
  'script': '𝒮𝒸𝓇𝒾𝓅𝓉',
  'gothic': '𝔊𝔬𝔱𝔥𝔦𝔠',
  'cursive': '𝓒𝓾𝓻𝓼𝓲𝓿𝓮'
};

export default function FancyTextGenerator() {
  const [text, setText] = useState('');
  const [fancyText, setFancyText] = useState('');

  const generateFancyText = (style: string) => {
    // This is a simplified version - in a real app, you'd want to use a proper font mapping
    const styleMap = {
      'bubble': (str: string) => str.split('').map(c => `ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ`.includes(c.toLowerCase()) ? c : c).join(''),
      'double': (str: string) => str.split('').map(c => `𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫`.includes(c.toLowerCase()) ? c : c).join(''),
      'script': (str: string) => str.split('').map(c => `𝒶𝒷𝒸𝒹𝑒𝒻𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃𝑜𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏`.includes(c.toLowerCase()) ? c : c).join(''),
      'gothic': (str: string) => str.split('').map(c => `𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷`.includes(c.toLowerCase()) ? c : c).join(''),
      'cursive': (str: string) => str.split('').map(c => `𝒶𝒷𝒸𝒹𝑒𝒻𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃𝑜𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏`.includes(c.toLowerCase()) ? c : c).join('')
    };

    const result = styleMap[style as keyof typeof styleMap]?.(text) || text;
    setFancyText(result);
  };

  // const copyToClipboard = () => {
  //   navigator.clipboard.writeText(fancyText);
  // };

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
            {Object.entries(fancyStyles).map(([style, label]) => (
              <div key={style} className="p-4 rounded-lg bg-white dark:bg-gray-700 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                  </h3>
                  <button
                    onClick={() => generateFancyText(style)}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    Generate
                  </button>
                </div>
                <div className="p-2 rounded bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white">
                  {fancyText}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 