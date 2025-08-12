import React, { useContext } from 'react'
// If you use a global context for language or feature flags:
import { AppContext } from '../context/AppContext' // Adjust path as needed

const featureLabels = {
  en: "Smart Survey Tool",
  hi: "स्मार्ट सर्वे टूल"
};

const aiLabel = {
  en: "Powered by AI",
  hi: "एआई द्वारा संचालित"
};

const voiceLabel = {
  en: "Voice Ready",
  hi: "वॉयस समर्थन"
};

const Footer = () => {
  // If using context/global state, otherwise default to "en"
  const { selectedLang = "en", aiEnabled = true, voiceEnabled = true } = useContext(AppContext) || {};
  
  return (
    <footer className="bg-gray-100 text-center py-4 mt-8 border-t border-gray-200">
      <p className="text-gray-600 text-sm mb-1">
        © {featureLabels[selectedLang] || featureLabels.en}
      </p>
      <div className="flex justify-center gap-3 text-xs mb-1">
        {/* Show info badges if features are enabled */}
        {aiEnabled && (
          <span className="inline-flex items-center bg-purple-100 text-purple-800 font-semibold px-2 py-1 rounded">
            🤖 {aiLabel[selectedLang] || aiLabel.en}
          </span>
        )}
        {voiceEnabled && (
          <span className="inline-flex items-center bg-teal-100 text-teal-800 font-semibold px-2 py-1 rounded">
            🎙️ {voiceLabel[selectedLang] || voiceLabel.en}
          </span>
        )}
      </div>
      {/* Optionally, link to your project's Github/Docs */}
      {/* <a href="https://github.com/yourrepo" className="text-blue-600 underline text-xs">View on GitHub</a> */}
    </footer>
  );
};

export default Footer;
