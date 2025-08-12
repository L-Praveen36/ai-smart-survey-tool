import React, { useState, useEffect } from 'react';

// If you want to highlight enabled features as badges, pass these as props or via context
const featureBadges = [
  { key: 'aiEnabled', icon: '🤖', label: 'AI' },
  { key: 'voiceEnabled', icon: '🎙️', label: 'Voice' },
  { key: 'adaptiveEnabled', icon: '⚡', label: 'Adaptive' },
];

// Full list of supported languages. Add/remove as you expand backend support.
const supportedLanguages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'ur', label: 'اردو' },
];

const TranslationSelector = ({
  value = 'en',
  onLanguageChange,
  aiEnabled = true,
  voiceEnabled = true,
  adaptiveEnabled = true,
}) => {
  const [selectedLang, setSelectedLang] = useState(value);

  useEffect(() => {
    if (value !== selectedLang) setSelectedLang(value);
  }, [value]);

  const handleChange = (e) => {
    const newLang = e.target.value;
    setSelectedLang(newLang);
    if (onLanguageChange) {
      onLanguageChange(newLang);
    }
  };

  return (
    <div className="p-5 bg-white rounded-xl shadow-lg max-w-xs mx-auto text-center border border-gray-100">
      <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center justify-center gap-2">
        🌐 Select Language
        <div className="flex gap-1 ml-2">
          {/* Feature badges */}
          {aiEnabled && (
            <span className="bg-purple-100 text-purple-700 px-2 rounded text-xs font-bold">🤖</span>
          )}
          {voiceEnabled && (
            <span className="bg-teal-100 text-teal-700 px-2 rounded text-xs font-bold">🎙️</span>
          )}
          {adaptiveEnabled && (
            <span className="bg-yellow-100 text-yellow-700 px-2 rounded text-xs font-bold">⚡</span>
          )}
        </div>
      </h2>
      <select
        value={selectedLang}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-blue-400 transition duration-150"
        aria-label="Choose survey display language"
      >
        {supportedLanguages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TranslationSelector;
