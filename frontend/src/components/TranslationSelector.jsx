import React, { useState } from 'react';

const supportedLanguages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'ur', label: 'اردو' },
];

const TranslationSelector = ({ onLanguageChange }) => {
  const [selectedLang, setSelectedLang] = useState('en');

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
      </h2>
      <select
        value={selectedLang}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-blue-400 transition duration-150"
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
