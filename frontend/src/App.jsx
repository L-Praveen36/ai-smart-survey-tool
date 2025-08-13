import React, { useState } from 'react';
import SurveyBuilder from './components/SurveyBuilder';
import SurveyInterface from './components/SurveyInterface';

function App() {
  const [generatedSurvey, setGeneratedSurvey] = useState(null);
  const [showSurvey, setShowSurvey] = useState(false); // Track whether to show the survey

  const handleBackToGenerator = () => {
    setGeneratedSurvey(null);
    setShowSurvey(false); // Reset showSurvey state
  };

  const handleShowSurvey = () => {
    setShowSurvey(true); // Set showSurvey state to true
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {!generatedSurvey ? (
        <SurveyBuilder onSurveyGenerated={(survey) => {
          setGeneratedSurvey(survey);
          setShowSurvey(true); // Show survey after generation
        }} />
      ) : (
        showSurvey ? (
          <SurveyInterface
            survey={generatedSurvey}
            onBack={handleBackToGenerator}
          />
        ) : (
          <div className="text-center">
            <button
              onClick={handleShowSurvey}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              View Generated Survey
            </button>
          </div>
        )
      )}
    </div>
  );
}

export default App;