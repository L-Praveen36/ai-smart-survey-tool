import React, { useContext } from 'react';
import { ReactComponent as Logo } from '../assets/logo.svg'; // Confirm logo.svg in src/assets

// If you use a global context for language and features, import it; otherwise, default values
import { AppContext } from '../context/AppContext'; // Adjust path if needed

// Localized content/descriptions
const HERO_CONTENT = {
  en: {
    title: "Smart Survey Tool",
    subtitle: "AI-powered, multilingual, voice-enabled, and field-ready survey system built for inclusivity and efficiency.",
    cta: "Explore Features",
    features: [
      { label: "AI", icon: "🤖" },
      { label: "Multilingual", icon: "🌐" },
      { label: "Voice", icon: "🎙️" },
      { label: "Adaptive", icon: "⚡" }
    ]
  },
  hi: {
    title: "स्मार्ट सर्वे टूल",
    subtitle: "एआई-संचालित, बहुभाषी, वॉयस-सक्षम सर्वे प्रणाली, समावेशिता और कार्यक्षमता के लिए तैयार।",
    cta: "फीचर्स देखें",
    features: [
      { label: "एआई", icon: "🤖" },
      { label: "बहुभाषी", icon: "🌐" },
      { label: "वॉयस", icon: "🎙️" },
      { label: "एडैप्टिव", icon: "⚡" }
    ]
  }
  // Add more languages if needed
};

const HeroSection = () => {
  // Grab global state/context if available; fallback to English
  const { selectedLang = "en", aiEnabled = true, voiceEnabled = true, adaptiveEnabled = true, multilingualEnabled = true } =
    useContext(AppContext) || {};

  const content = HERO_CONTENT[selectedLang] || HERO_CONTENT.en;

  // Determine which feature badges to show (based on flags)
  const featureBadges = [
    aiEnabled && content.features[0],
    multilingualEnabled && content.features[1],
    voiceEnabled && content.features[2],
    adaptiveEnabled && content.features[3]
  ].filter(Boolean);

  return (
    <section className="bg-gradient-to-br from-blue-100 via-white to-blue-50 py-20 px-6" id="hero">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        {/* Text Content */}
        <div className="text-center md:text-left md:w-1/2">
          <h1 className="text-5xl md:text-6xl font-extrabold text-blue-900 mb-6 leading-tight tracking-tight">
            {content.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-5 max-w-lg mx-auto md:mx-0">
            {content.subtitle}
          </p>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-6">
            {featureBadges.map(badge => (
              <span key={badge.label} className="inline-flex items-center bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded text-sm shadow-sm border border-blue-200">
                <span className="mr-2">{badge.icon}</span>
                <span>{badge.label}</span>
              </span>
            ))}
          </div>
          <a
            href="#features"
            className="inline-block px-8 py-3 bg-blue-700 text-white text-lg font-semibold rounded-xl shadow-md hover:bg-blue-800 hover:shadow-lg transition-all duration-200"
          >
            {content.cta}
          </a>
        </div>
        {/* Logo */}
        <div className="mt-10 md:mt-0 md:w-1/2 flex justify-center">
          <Logo className="w-64 h-64 md:w-80 md:h-80 drop-shadow-md" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
