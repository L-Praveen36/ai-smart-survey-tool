import React, { useState } from 'react';
import SurveyBuilder from './components/SurveyBuilder';
import SurveyInterface from './components/SurveyInterface';
import axios from 'axios'; // Import axios

function App() {
  const [generatedSurvey, setGeneratedSurvey] = useState(null);

  const handleSaveSurvey = async (surveyData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/surveys/save`,
        surveyData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {!generatedSurvey ? (
        <SurveyBuilder onSurveyGenerated={setGeneratedSurvey} />
      ) : (
        <SurveyInterface 
          survey={generatedSurvey} 
          onBack={() => setGeneratedSurvey(null)} 
          onSaveSurvey={handleSaveSurvey}
        />
      )}
    </div>
  );
}

export default App;