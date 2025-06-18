'use client';
import React, { useState, useRef } from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';

const inputStyle =
  'w-full font-bold text-center bg-transparent border-none focus:ring-0 focus:outline-none text-white placeholder-gray-600 text-3xl md:text-4xl py-2';
const labelStyle =
  'block text-sm md:text-base font-medium text-gray-400 text-center';

function getHighlightedText(text: string, pattern: string, flags: string) {
  if (!pattern || pattern.trim() === '') return [text];
  try {
    const regex = new RegExp(pattern, flags);
    if (!regex.global) return [text]; // Only highlight with global flag
    let lastIndex = 0;
    const result: (string | { match: string })[] = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        result.push(text.slice(lastIndex, match.index));
      }
      result.push({ match: match[0] });
      lastIndex = regex.lastIndex;
      // Avoid infinite loop for zero-width matches
      if (match.index === regex.lastIndex) regex.lastIndex++;
    }
    if (lastIndex < text.length) {
      result.push(text.slice(lastIndex));
    }
    return result;
  } catch {
    return [text];
  }
}

const RegexTester: React.FC = () => {
  const [testText, setTestText] = useState('');
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [matches, setMatches] = useState<RegExpMatchArray | null>(null);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const [selectedPreset, setSelectedPreset] = useState('custom');

  const regexPresets = [
    {
      label: 'Custom',
      pattern: '',
      flags: 'g',
    },
    {
      label: 'Find all words',
      pattern: '\\w+',
      flags: 'g',
    },
    {
      label: 'Find emails',
      pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
      flags: 'g',
    },
    {
      label: 'Find numbers',
      pattern: '\\d+',
      flags: 'g',
    },
    {
      label: 'Find hashtags',
      pattern: '#\\w+',
      flags: 'g',
    },
    {
      label: 'Find URLs',
      pattern: 'https?:\\/\\/[^\\s]+',
      flags: 'g',
    },
    {
      label: 'Find duplicate words',
      pattern: '\\b(\\w+)\\s+\\1\\b',
      flags: 'gi',
    },
    {
      label: 'Find capitalized words',
      pattern: '\\b[A-Z][a-z]*\\b',
      flags: 'g',
    },
  ];

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedPreset(value);
    const preset = regexPresets.find(p => p.label === value);
    if (preset) {
      setPattern(preset.pattern);
      setFlags(preset.flags);
    }
  };

  // Sync scroll between textarea and highlight overlay
  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  // Update matches as you type
  React.useEffect(() => {
    if (!pattern || pattern.trim() === '') {
      setMatches(null);
      setError(null);
      return;
    }
    
    try {
      setError(null);
      const regex = new RegExp(pattern, flags);
      const result = testText.match(regex);
      setMatches(result);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Invalid regex pattern');
      setMatches(null);
    }
  }, [testText, pattern, flags]);

  const highlighted = getHighlightedText(testText, pattern, flags);

  const getMatchesJson = () => {
    if (!matches || matches.length === 0) return '{}';
    
    const matchesData = matches.map((match, index) => {
      const regex = new RegExp(pattern, flags);
      const execResult = regex.exec(testText);
      
      return {
        index: index,
        text: match,
        position: execResult ? execResult.index : null,
        groups: execResult ? execResult.slice(1) : [],
        fullMatch: execResult ? Array.from(execResult) : null
      };
    });
    
    return JSON.stringify(matchesData, null, 2);
  };

  return (
    <div className="flex flex-col w-full h-full min-h-[400px] m-0">
      {/* Top: Highlighted editable area */}
      <div className="w-full border-b border-gray-800 flex-1 relative">
        <div className="relative w-full h-full overflow-y-auto">
          {/* Highlight overlay */}
          <div
            ref={highlightRef}
            className="absolute inset-0 pointer-events-none whitespace-pre-wrap break-words rounded-lg p-3 text-lg text-left font-mono bg-transparent z-11"
            style={{ color: 'transparent', WebkitTextFillColor: 'transparent' }}
            aria-hidden="true"
          >
            {highlighted.map((part, i) =>
              typeof part === 'string' ? (
                <span key={i} style={{ color: 'inherit', WebkitTextFillColor: 'inherit' }}>{part}</span>
              ) : (
                <span
                  key={i}
                  className="bg-yellow-300 text-gray-900 rounded"
                  style={{ color: '#111', WebkitTextFillColor: '#111' }}
                >
                  {part.match}
                </span>
              )
            )}
          </div>
          {/* Transparent textarea for input */}
          <textarea
            ref={textareaRef}
            className="w-full h-full d-block bg-transparent p-3 text-white text-lg focus:outline-none resize-y relative z-10 caret-yellow-400"
            placeholder="Paste or type your test text here..."
            value={testText}
            onChange={e => setTestText(e.target.value)}
            onScroll={handleScroll}
            spellCheck={false}
            style={{ background: 'none', position: 'relative' }}
          />
        </div>
      </div>
      {/* Bottom: Two columns */}
      <div className="flex flex-col md:flex-row flex-1 w-full">
        {/* Left: Regex input */}
        <div className="flex flex-col flex-1 border-b-0 md:border-r border-gray-800">
          <div className="flex flex-col flex-1 border-b border-gray-800 items-center justify-center p-4">
            <label className={labelStyle}>Regex Pattern</label>
            <input
              className={inputStyle + ' text-lg md:text-2xl'}
              placeholder="e.g. (\\w+)"
              value={pattern}
              onChange={e => setPattern(e.target.value)}
            />
          </div>

          <div className="flex flex-col flex-1 border-b border-gray-800 items-center justify-center p-4">
            <label className={labelStyle}>Flags</label>
            <input
              className={inputStyle + ' text-base md:text-lg'}
              placeholder="e.g. gim"
              value={flags}
              onChange={e => {
                setFlags(e.target.value);
                setSelectedPreset('custom');
              }}
              maxLength={5}
            />
          </div>

          <div className="flex flex-col flex-1 items-center justify-center p-4">
          <label className={labelStyle}>Presets</label>
          <select
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white text-base mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedPreset}
            onChange={handlePresetChange}
          >
            {regexPresets.map((preset) => (
              <option key={preset.label} value={preset.label}>
                {preset.label}
              </option>
            ))}
          </select>
          </div>

          <div className="flex flex-col">
            {error && <div className="mt-4 text-red-400 font-mono">{error}</div>}
          </div>
        </div>
        {/* Right: Results */}
        <div className="flex flex-col flex-1 overflow-y-auto max-h-[500px]">
          <div className="p-4 border-b border-gray-800">
            <label className={labelStyle}>Matches</label>
          </div>
          {matches && matches.length > 0 ? (
            <div className="bg-gray-900 overflow-hidden">
              <AceEditor
                mode="json"
                theme="monokai"
                value={getMatchesJson()}
                readOnly={true}
                width="100%"
                height="400px"
                setOptions={{
                  enableBasicAutocompletion: false,
                  enableLiveAutocompletion: false,
                  enableSnippets: false,
                  showLineNumbers: true,
                  tabSize: 2,
                }}
                style={{
                  backgroundColor: '#0D1117',
                }}
              />
            </div>
          ) : pattern && pattern.trim() !== '' ? (
            <div className="text-gray-500 font-mono p-4">No matches found.</div>
          ) : (
            <div className="text-gray-500 font-mono p-4">Enter a regex pattern to see matches.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegexTester;
