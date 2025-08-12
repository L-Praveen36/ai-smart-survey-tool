import React, { useContext } from "react";
// If using a global context for language/features:
import { AppContext } from "../context/AppContext"; // Adjust path as needed

const LOGO_TEXTS = {
  en: "Smart Survey",
  hi: "स्मार्ट सर्वे"
};

// Optionally show feature badges near logo based on enabled features
const FEATURE_ICONS = [
  { key: "aiEnabled", icon: "🤖", label: "AI" },
  { key: "voiceEnabled", icon: "🎙️", label: "Voice" },
  { key: "adaptiveEnabled", icon: "⚡", label: "Adaptive" }
];

const Logo = () => {
  // Use global context if available; fallback to English and all features enabled
  const { selectedLang = "en", aiEnabled = true, voiceEnabled = true, adaptiveEnabled = true } = useContext(AppContext) || {};

  return (
    <div className="flex items-center space-x-3" aria-label="Smart Survey Logo">
      {/* Icon */}
      <div
        className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-400 rounded-full animate-pulse shadow-md border border-white flex items-center justify-center"
        aria-label="Brand icon"
      ></div>

      {/* Text */}
      <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text animate-gradient drop-shadow-sm">
        {LOGO_TEXTS[selectedLang] || LOGO_TEXTS.en}
      </h1>

      {/* Feature indicator icons */}
      <div className="flex items-center space-x-1 ml-2">
        {FEATURE_ICONS.map(
          ({ key, icon, label }) =>
            eval(key) && (
              <span
                key={key}
                className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 font-bold shadow mr-1"
                title={label}
              >
                {icon}
              </span>
            )
        )}
      </div>
    </div>
  );
};

export default Logo;
