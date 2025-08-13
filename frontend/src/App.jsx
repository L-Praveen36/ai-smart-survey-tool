import React, { useState } from 'react';
import SurveyBuilder from './components/SurveyBuilder';
import SurveyInterface from './components/SurveyInterface';

function App() {
  const [generatedSurvey, setGeneratedSurvey] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {!generatedSurvey ? (
        <SurveyBuilder onSurveyGenerated={setGeneratedSurvey} />
      ) : (
        <SurveyInterface 
          survey={generatedSurvey} 
          onBack={() => setGeneratedSurvey(null)} 
        />
      )}
    </div>
  );
}

export default App;