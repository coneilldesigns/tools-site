'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

const inputStyle =
  'w-full h-full font-bold text-center bg-transparent border-none focus:ring-0 focus:outline-none text-white placeholder-gray-600 text-3xl md:text-4xl py-2';
const labelStyle =
  'block text-sm md:text-base font-medium text-gray-400 my-2 text-center';

const CopyIcon = ({ copied, onClick }: { copied: boolean; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={`ml-2 transition-all duration-200 ${copied ? 'text-green-400' : 'text-gray-400 hover:text-blue-400'} flex items-center justify-center`}
    style={{ outline: 'none' }}
    tabIndex={-1}
    aria-label="Copy to clipboard"
  >
    {copied ? (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="inline-block">
        <path d="M5 10.5l4 4 6-7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ) : (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="inline-block">
        <rect x="7" y="7" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="2"/>
        <rect x="4" y="4" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="2"/>
      </svg>
    )}
  </button>
);

function rgbaToString(r: number, g: number, b: number, a: number) {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

const BoxShadowGenerator: React.FC = () => {
  const [params, setParams] = useState({
    hOffset: 8,
    vOffset: 8,
    blur: 8,
    spread: 0,
    color: { r: 0, g: 0, b: 0, a: 0.75 },
    inset: false,
  });
  const [copied, setCopied] = useState(false);

  const handleParam = (key: keyof typeof params, value: number | boolean) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };
  const handleColor = (channel: 'r' | 'g' | 'b' | 'a', value: number) => {
    setParams((prev) => ({ ...prev, color: { ...prev.color, [channel]: value } }));
  };

  const boxShadow = `${params.inset ? 'inset ' : ''}${params.hOffset}px ${params.vOffset}px ${params.blur}px ${params.spread}px ${rgbaToString(params.color.r, params.color.g, params.color.b, params.color.a)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(boxShadow);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-full min-h-[400px] m-0">
      {/* Left: Inputs */}
      <div className="flex flex-col flex-1 border-b-0 md:border-r border-gray-800">
        {/* Main Controls Grid for mobile */}
        <div className="flex flex-wrap w-full flex-1">
          {/* Row 1 */}
          <div className="flex w-full flex-wrap md:flex-col md:flex-1">
            {/* Horizontal Offset */}
            <motion.div
              className="w-1/2 md:w-full border-b border-r border-gray-800 flex-1 flex flex-col items-center justify-center"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <div className="flex w-full h-full">
                <div className="flex-1 flex items-center justify-center p-3">
                  <input
                    type="number"
                    value={params.hOffset}
                    onChange={e => handleParam('hOffset', Number(e.target.value))}
                    className={inputStyle}
                    min={-200}
                    max={200}
                  />
                </div>
              </div>
              <div className="border-t border-gray-800 w-full flex items-center justify-center">
                <span className={labelStyle}>Horizontal Offset (px)</span>
              </div>
            </motion.div>
            {/* Vertical Offset */}
            <motion.div
              className="w-1/2 md:w-full border-b md:border-r border-gray-800 flex-1 flex flex-col items-center justify-center"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <div className="flex w-full h-full">
                <div className="flex-1 flex items-center justify-center p-3">
                  <input
                    type="number"
                    value={params.vOffset}
                    onChange={e => handleParam('vOffset', Number(e.target.value))}
                    className={inputStyle}
                    min={-200}
                    max={200}
                  />
                </div>
              </div>
              <div className="border-t border-gray-800 w-full flex items-center justify-center">
                <span className={labelStyle}>Vertical Offset (px)</span>
              </div>
            </motion.div>
          </div>
          {/* Row 2 */}
          <div className="flex w-full flex-wrap md:flex-col md:flex-1">
            {/* Blur Radius */}
            <motion.div
              className="w-1/2 md:w-full border-b border-r border-gray-800 flex-1 flex flex-col items-center justify-center"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <div className="flex w-full h-full">
                <div className="flex-1 flex items-center justify-center p-3">
                  <input
                    type="number"
                    value={params.blur}
                    onChange={e => handleParam('blur', clamp(Number(e.target.value), 0, 200))}
                    className={inputStyle}
                    min={0}
                    max={200}
                  />
                </div>
              </div>
              <div className="border-t border-gray-800 w-full flex items-center justify-center">
                <span className={labelStyle}>Blur Radius (px)</span>
              </div>
            </motion.div>
            {/* Spread Radius */}
            <motion.div
              className="w-1/2 md:w-full border-b border-gray-800 flex-1 flex flex-col items-center justify-center"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <div className="flex w-full h-full">
                <div className="flex-1 flex items-center justify-center p-3">
                  <input
                    type="number"
                    value={params.spread}
                    onChange={e => handleParam('spread', Number(e.target.value))}
                    className={inputStyle}
                    min={-100}
                    max={100}
                  />
                </div>
              </div>
              <div className="border-t border-gray-800 w-full flex items-center justify-center">
                <span className={labelStyle}>Spread (px)</span>
              </div>
            </motion.div>
          </div>
        </div>
        {/* Color RGBA */}
        <motion.div
          className="w-full border-b border-gray-800 flex flex-col items-center justify-center"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <div className="flex w-full h-full">
            <div className="flex-1 flex items-center justify-center p-3">
              <input
                type="number"
                value={params.color.r}
                onChange={e => handleColor('r', clamp(Number(e.target.value), 0, 255))}
                className={inputStyle + ' w-1/5'}
                min={0}
                max={255}
              />
            </div>
            <div className="flex-1 flex items-center justify-center p-3">
              <input
                type="number"
                value={params.color.g}
                onChange={e => handleColor('g', clamp(Number(e.target.value), 0, 255))}
                className={inputStyle + ' w-1/5'}
                min={0}
                max={255}
              />
            </div>
            <div className="flex-1 flex items-center justify-center p-3">
              <input
                type="number"
                value={params.color.b}
                onChange={e => handleColor('b', clamp(Number(e.target.value), 0, 255))}
                className={inputStyle + ' w-1/5'}
                min={0}
                max={255}
              />
            </div>
            <div className="flex-1 flex items-center justify-center p-3">
              <input
                type="number"
                value={params.color.a}
                onChange={e => handleColor('a', clamp(Number(e.target.value), 0, 1))}
                className={inputStyle + ' w-1/5'}
                min={0}
                max={1}
                step={0.01}
              />
            </div>
          </div>
          <div className="border-t border-gray-800 w-full flex items-center justify-center">
            <span className={labelStyle}>Color (RGBA)</span>
          </div>
        </motion.div>
        {/* Inset Toggle */}
        <motion.div
          className="w-full border-gray-800  flex flex-col items-center justify-center"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <div className="flex w-full h-full items-center justify-center p-3">
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={params.inset}
                onChange={e => handleParam('inset', e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className={labelStyle}>Inset</span>
            </label>
          </div>
        </motion.div>
      </div>
      {/* Right: Preview & Output */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] p-6" style={{ background: '#f3f4f6' }}>
        <div className="w-full flex flex-col items-center justify-center" >
          <div className="mb-6">
            <div
              className="rounded-lg bg-gray-300 border border-gray-400 shadow-lg"
              style={{ width: 220, height: 120, boxShadow }}
            />
          </div>
          <div className="w-full flex flex-col items-center">
            <div className="flex items-center w-full justify-center">
              <input
                type="text"
                value={boxShadow}
                readOnly
                className={inputStyle + ' w-full'}
                style={{ fontSize: 18, color: '#000' }}
              />
              <CopyIcon copied={copied} onClick={handleCopy} />
            </div>
            <span className={labelStyle}>CSS box-shadow</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoxShadowGenerator;
