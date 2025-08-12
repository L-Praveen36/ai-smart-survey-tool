import React, { useState } from 'react';

import Navbar from './components/Navbar';
import Logo from './components/Logo';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import Footer from './components/Footer';
import SurveyBuilder from './components/SurveyBuilder';
import Dashboard from './components/Dashboard';
import VoiceRecorder from './components/VoiceRecorder';
import TranslationSelector from './components/TranslationSelector';

const DEFAULT_LANG = 'en';

function App() {
  // Feature flags: all live and togglable
  const [selectedLang, setSelectedLang] = useState(DEFAULT_LANG);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [adaptiveEnabled, setAdaptiveEnabled] = useState(true);

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
      <Navbar
        selectedLang={selectedLang}
        aiEnabled={aiEnabled}
        voiceEnabled={voiceEnabled}
        adaptiveEnabled={adaptiveEnabled}
      />
      <main className="flex-grow">
        <section className="py-8 text-center">
          <Logo
            selectedLang={selectedLang}
            aiEnabled={aiEnabled}
            voiceEnabled={voiceEnabled}
            adaptiveEnabled={adaptiveEnabled}
          />
        </section>
        <HeroSection
          selectedLang={selectedLang}
          aiEnabled={aiEnabled}
          voiceEnabled={voiceEnabled}
          adaptiveEnabled={adaptiveEnabled}
        />
        <section className="py-16">
          <FeaturesSection
            selectedLang={selectedLang}
            aiEnabled={aiEnabled}
            voiceEnabled={voiceEnabled}
            adaptiveEnabled={adaptiveEnabled}
          />
        </section>
        <section className="my-8 flex justify-center">
          <TranslationSelector
            value={selectedLang}
            onLanguageChange={setSelectedLang}
            aiEnabled={aiEnabled}
            voiceEnabled={voiceEnabled}
            adaptiveEnabled={adaptiveEnabled}
          />
        </section>
        {/* Future pages can be routed or placed here: */}
        <SurveyBuilder
          selectedLang={selectedLang}
          aiEnabled={aiEnabled}
          voiceEnabled={voiceEnabled}
          adaptiveEnabled={adaptiveEnabled}
        />
        <Dashboard
          selectedLang={selectedLang}
          aiEnabled={aiEnabled}
          voiceEnabled={voiceEnabled}
          adaptiveEnabled={adaptiveEnabled}
        />
        <VoiceRecorder />
      </main>
      <Footer
        selectedLang={selectedLang}
        aiEnabled={aiEnabled}
        voiceEnabled={voiceEnabled}
        adaptiveEnabled={adaptiveEnabled}
      />
    </div>
  );
}
export default App;
