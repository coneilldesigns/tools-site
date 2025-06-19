'use client';
import React, { useState } from 'react';
import AceEditor from 'react-ace';
import { HighlightWithinTextarea } from 'react-highlight-within-textarea';

import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';

const inputStyle =
  'w-full font-bold text-center bg-transparent border-none focus:ring-0 focus:outline-none text-white placeholder-gray-600 text-3xl md:text-4xl py-2';
const labelStyle =
  'block text-sm md:text-base font-medium text-gray-400 text-center';

const RegexTester: React.FC = () => {
  const [testText, setTestText] = useState('');
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [matches, setMatches] = useState<RegExpMatchArray | null>(null);
  const [error, setError] = useState<string | null>(null);
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

  const getMatchesJson = () => {
    if (!matches || matches.length === 0) return '{}';
    
    try {
      const regex = new RegExp(pattern, flags);
      const matchesData = matches.map((match, index) => {
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
    } catch (e) {
      // Return error information instead of crashing
      return JSON.stringify({
        error: 'Invalid regex pattern',
        message: e instanceof Error ? e.message : 'Unknown error'
      }, null, 2);
    }
  };

  // Create highlight pattern for the component
  const getHighlightPattern = () => {
    if (!pattern || pattern.trim() === '') return null;
    try {
      return new RegExp(pattern, flags);
    } catch {
      return null;
    }
  };

  return (
    <div className="flex flex-col w-full h-full min-h-[400px] m-0">
      {/* Top: Highlighted editable area */}
      <div className="w-full border-b border-gray-800 flex-1 relative max-h-[500px] overflow-y-auto">
        <div className="relative w-full h-full">
          <div className="w-full h-full bg-transparent p-3 text-white text-lg focus:outline-none resize-y font-mono">
            <HighlightWithinTextarea
              value={testText}
              onChange={setTestText}
              highlight={getHighlightPattern()}
              placeholder="Paste or type your test text here..."
            />
          </div>
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

          {error && (
            <div className="flex flex-col p-3 bg-red-900 text-center">
              <div className="text-white-400 text-xs font-mono">{error}</div>
            </div>
          )}
        </div>
        {/* Right: Results */}
        <div className="flex flex-col flex-1">
          <div className="p-4 border-b border-gray-800">
            <label className={labelStyle}>Matches</label>
          </div>
          {matches && matches.length > 0 ? (
            <div className="bg-gray-900 overflow-hidden flex-1 flex flex-col">
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
                  flex: 1,
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
