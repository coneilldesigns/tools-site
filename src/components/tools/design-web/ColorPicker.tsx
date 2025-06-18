'use client';
import React, { useState } from 'react';
import { RgbaColorPicker } from 'react-colorful';
import { motion } from 'framer-motion';

function hexToRgb(hex: string) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
  const num = parseInt(c, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(h: number, s: number, l: number) {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

const inputStyle =
  'w-full font-bold text-center bg-transparent border-none focus:ring-0 focus:outline-none text-white placeholder-gray-600 text-3xl md:text-4xl py-2';
const labelStyle =
  'block text-sm md:text-base font-medium text-gray-400 my-2 text-center';

// Helper for copy icon
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
      // Checkmark SVG
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="inline-block">
        <path d="M5 10.5l4 4 6-7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ) : (
      // Copy SVG
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="inline-block">
        <rect x="7" y="7" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="2"/>
        <rect x="4" y="4" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="2"/>
      </svg>
    )}
  </button>
);

// Conversion functions for CMYK
function rgbToCmyk(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const k = 1 - Math.max(r, g, b);
  const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
  const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
  const y = k === 1 ? 0 : (1 - b - k) / (1 - k);
  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  };
}
function cmykToRgb(c: number, m: number, y: number, k: number) {
  c /= 100; m /= 100; y /= 100; k /= 100;
  const r = Math.round(255 * (1 - c) * (1 - k));
  const g = Math.round(255 * (1 - m) * (1 - k));
  const b = Math.round(255 * (1 - y) * (1 - k));
  return { r, g, b };
}

const ColorPicker: React.FC = () => {
  const [rgba, setRgba] = useState({ r: 16, g: 185, b: 129, a: 1 });
  const rgb = { r: rgba.r, g: rgba.g, b: rgba.b };
  const hex = rgbToHex(rgba.r, rgba.g, rgba.b);
  const hsl = rgbToHsl(rgba.r, rgba.g, rgba.b);
  const cmyk = rgbToCmyk(rgba.r, rgba.g, rgba.b);

  // Copy state for each label
  const [copied, setCopied] = useState<{ [key: string]: boolean }>({});

  // Handlers
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (!value.startsWith('#')) value = '#' + value;
    if (/^#([0-9A-Fa-f]{3}){1,2}$/.test(value)) {
      const rgbVal = hexToRgb(value);
      setRgba({ ...rgba, ...rgbVal });
    }
  };

  const handleRgbChange = (e: React.ChangeEvent<HTMLInputElement>, channel: 'r' | 'g' | 'b') => {
    const val = clamp(Number(e.target.value), 0, 255);
    setRgba({ ...rgba, [channel]: val });
  };

  const handleAlphaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = clamp(Number(e.target.value), 0, 1);
    setRgba({ ...rgba, a: val });
  };

  const handleHslChange = (e: React.ChangeEvent<HTMLInputElement>, channel: 'h' | 's' | 'l') => {
    let val = Number(e.target.value);
    if (channel === 'h') val = clamp(val, 0, 360);
    else val = clamp(val, 0, 100);
    const newHsl = { ...hsl, [channel]: val };
    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    setRgba({ ...rgba, ...newRgb });
  };

  const handleCopy = (label: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopied((prev) => ({ ...prev, [label]: true }));
    setTimeout(() => setCopied((prev) => ({ ...prev, [label]: false })), 1000);
  };

  const handleCmykChange = (e: React.ChangeEvent<HTMLInputElement>, channel: 'c' | 'm' | 'y' | 'k') => {
    const val = clamp(Number(e.target.value), 0, 100);
    const newCmyk = { ...cmyk, [channel]: val };
    const newRgb = cmykToRgb(newCmyk.c, newCmyk.m, newCmyk.y, newCmyk.k);
    setRgba({ ...rgba, ...newRgb });
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-full min-h-[400px] m-0">
      {/* Left: Inputs */}
      <div className="flex flex-col flex-1 border-b-0 md:border-r border-gray-800">
        {/* HEX */}
        <motion.div
          className="w-full border-b border-gray-800 flex-1 flex flex-col items-center justify-center"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <div className="flex w-full h-full">
            <div className="border-r border-gray-800 flex-1 flex items-center justify-center p-3">
              <input
                type="text"
                value={hex}
                onChange={handleHexChange}
                className={inputStyle}
                maxLength={7}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
              />
            </div>
          </div>
          <div className="border-t border-gray-800 w-full flex items-center justify-center">
            <span className={labelStyle}>HEX</span>
            <CopyIcon
              copied={!!copied.hex}
              onClick={() => handleCopy('hex', hex)}
            />
          </div>
        </motion.div>
        {/* RGB */}
        <motion.div
          className="w-full border-b border-gray-800 flex-1 flex flex-col items-center justify-center"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <div className="flex w-full h-full">
            <div className="border-r border-gray-800 flex-1 flex items-center justify-center p-3">
              <input
                type="number"
                value={rgb.r}
                onChange={(e) => handleRgbChange(e, 'r')}
                min={0}
                max={255}
                className={inputStyle + ' w-1/4'}
              />
            </div>
            <div className="border-r border-gray-800 flex-1 flex items-center justify-center p-3">
              <input
                type="number"
                value={rgb.g}
                onChange={(e) => handleRgbChange(e, 'g')}
                min={0}
                max={255}
                className={inputStyle + ' w-1/4'}
              />
            </div>
            <div className="flex-1 flex items-center justify-center p-3">
              <input
                type="number"
                value={rgb.b}
                onChange={(e) => handleRgbChange(e, 'b')}
                min={0}
                max={255}
                className={inputStyle + ' w-1/4'}
              />
            </div>
          </div>
          <div className="border-t border-gray-800 w-full flex items-center justify-center">
            <span className={labelStyle}>RGB</span>
            <CopyIcon
              copied={!!copied.rgb}
              onClick={() => handleCopy('rgb', `rgb(${rgba.r}, ${rgba.g}, ${rgba.b})`)}
            />
          </div>
        </motion.div>
        {/* RGBA */}
        <motion.div
          className="w-full border-b border-gray-800 flex-1 flex flex-col items-center justify-center"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <div className="flex w-full h-full">
            <div className="border-r border-gray-800 flex-1 flex items-center justify-center p-3">
              <input
                type="number"
                value={rgba.r}
                onChange={(e) => handleRgbChange(e, 'r')}
                min={0}
                max={255}
                className={inputStyle + ' w-1/5'}
              />
            </div>
            <div className="border-r border-gray-800 flex-1 flex items-center justify-center p-3">
              <input
                type="number"
                value={rgba.g}
                onChange={(e) => handleRgbChange(e, 'g')}
                min={0}
                max={255}
                className={inputStyle + ' w-1/5'}
              />
            </div>
            <div className="border-r border-gray-800 flex-1 flex items-center justify-center p-3">
              <input
                type="number"
                value={rgba.b}
                onChange={(e) => handleRgbChange(e, 'b')}
                min={0}
                max={255}
                className={inputStyle + ' w-1/5'}
              />
            </div>
            <div className="flex-1 flex items-center justify-center p-3">
              <input
                type="number"
                value={rgba.a}
                onChange={handleAlphaChange}
                min={0}
                max={1}
                step={0.01}
                className={inputStyle + ' w-1/5'}
              />
            </div>
          </div>
          <div className="border-t border-gray-800 w-full flex items-center justify-center">
            <span className={labelStyle}>RGBA</span>
            <CopyIcon
              copied={!!copied.rgba}
              onClick={() => handleCopy('rgba', `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${Number(rgba.a.toFixed(2))})`)}
            />
          </div>
        </motion.div>
        {/* HSL */}
        <motion.div
          className="w-full border-gray-800 flex-1 flex flex-col items-center justify-center"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <div className="flex w-full h-full">
            <div className="border-r border-gray-800 flex-1 flex items-center justify-center p-3">
            <input
              type="number"
              value={hsl.h}
              onChange={(e) => handleHslChange(e, 'h')}
              min={0}
              max={360}
              className={inputStyle + ' w-1/4'}
            />
            </div>
            <div className="border-r border-gray-800 flex-1 flex items-center justify-center p-3">
            <input
              type="number"
              value={hsl.s}
              onChange={(e) => handleHslChange(e, 's')}
              min={0}
              max={100}
              className={inputStyle + ' w-1/4'}
            />
            </div>
            <div className="flex-1 flex items-center justify-center p-3">
            <input
              type="number"
              value={hsl.l}
              onChange={(e) => handleHslChange(e, 'l')}
              min={0}
              max={100}
              className={inputStyle + ' w-1/4'}
            />
            </div>
          </div>
          <div className="border-t border-b border-gray-800 w-full flex items-center justify-center">
            <span className={labelStyle}>HSL</span>
            <CopyIcon
              copied={!!copied.hsl}
              onClick={() => handleCopy('hsl', `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}
            />
          </div>
        </motion.div>
        {/* CMYK */}
        <motion.div
          className="w-full border-gray-800 flex-1 flex flex-col items-center justify-center"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <div className="flex w-full h-full">
            <div className="border-r border-gray-800 flex-1 flex items-center justify-center p-3">
              <input
                type="number"
                value={cmyk.c}
                onChange={(e) => handleCmykChange(e, 'c')}
                min={0}
                max={100}
                className={inputStyle + ' w-1/4'}
              />
            </div>
            <div className="border-r border-gray-800 flex-1 flex items-center justify-center p-3">
              <input
                type="number"
                value={cmyk.m}
                onChange={(e) => handleCmykChange(e, 'm')}
                min={0}
                max={100}
                className={inputStyle + ' w-1/4'}
              />
            </div>
            <div className="border-r border-gray-800 flex-1 flex items-center justify-center p-3">
              <input
                type="number"
                value={cmyk.y}
                onChange={(e) => handleCmykChange(e, 'y')}
                min={0}
                max={100}
                className={inputStyle + ' w-1/4'}
              />
            </div>
            <div className="flex-1 flex items-center justify-center p-3">
              <input
                type="number"
                value={cmyk.k}
                onChange={(e) => handleCmykChange(e, 'k')}
                min={0}
                max={100}
                className={inputStyle + ' w-1/4'}
              />
            </div>
          </div>
          <div className="border-t border-gray-800 w-full flex items-center justify-center">
            <span className={labelStyle}>CMYK</span>
            <CopyIcon
              copied={!!copied.cmyk}
              onClick={() => handleCopy('cmyk', `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`)}
            />
          </div>
        </motion.div>
      </div>
      {/* Right: Color Picker */}
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="w-full h-full flex items-center justify-center">
          <RgbaColorPicker color={rgba} onChange={setRgba} style={{ width: '100%', height: '100%', borderRadius: 0 }} />
        </div>
      </div>
    </div>
  );
};

export default ColorPicker; 