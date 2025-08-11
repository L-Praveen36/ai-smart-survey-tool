import React from 'react';

import Navbar from './components/Navbar';
import Logo from './components/Logo';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import Footer from './components/Footer';

// Optional pages (can be routed later)
import SurveyBuilder from './components/SurveyBuilder';
import Dashboard from './components/Dashboard';
import VoiceRecorder from './components/VoiceRecorder';
import TranslationSelector from './components/TranslationSelector';

function App() {
  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Branding */}
        <section className="py-8 text-center">
          <Logo />
        </section>

        {/* Hero Banner */}
        <HeroSection />

        {/* Features */}
        <section className="py-16">
          <FeaturesSection />
        </section>

        {/* Future Components */}
        {/* 
        <SurveyBuilder />
        <Dashboard />
        <VoiceRecorder />
        <TranslationSelector />
        */}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
