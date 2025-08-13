import { useState } from 'react';
import SurveyInterface from './components/SurveyInterface';

const DEFAULT_LANG = 'en';

function App() {
  const [selectedLang, setSelectedLang] = useState(DEFAULT_LANG);
  const aiEnabled = true;
  const voiceEnabled = true;
  const adaptiveEnabled = true;

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <SurveyInterface
        selectedLang={selectedLang}
        aiEnabled={aiEnabled}
        voiceEnabled={voiceEnabled}
        adaptiveEnabled={adaptiveEnabled}
        onLanguageChange={setSelectedLang}
      />
    </div>
  );
}

export default App;
