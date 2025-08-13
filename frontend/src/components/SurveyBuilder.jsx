import React, { useState } from 'react';
import axios from 'axios';

const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
];

const SurveyBuilder = ({ onSurveyGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [languages, setLanguages] = useState(['en']);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [adaptiveEnabled, setAdaptiveEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleGenerateSurvey = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt before generating.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/surveys/generate-from-prompt`,
        {
          prompt,
          num_questions: numQuestions,
          languages,
          voice_enabled: voiceEnabled,
          adaptive_enabled: adaptiveEnabled,
          ai_generated: true
        }
      );

      // Normalize the response data
      const surveyData = {
        ...response.data,
        questions: response.data.questions?.map((q, idx) => ({
          id: idx + 1,
          text: q.question_text || q.text || `Question ${idx + 1}`,
          type: q.type || 'multiple_choice',
          options: q.options || [],
          ai_generated: true,
          voice_enabled: voiceEnabled,
          adaptive_enabled: adaptiveEnabled
        })) || []
      };

      onSurveyGenerated(surveyData);
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Survey generation failed. Please check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">AI Survey Generator</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Survey Prompt</label>
          <textarea
            className="w-full p-3 border rounded-lg"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to survey..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Questions</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={numQuestions}
              onChange={(e) => setNumQuestions(e.target.value)}
              min={1}
              max={20}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Languages</label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGE_OPTIONS.map((lang) => (
                <label key={lang.code} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={languages.includes(lang.code)}
                    onChange={() => {
                      setLanguages(prev => 
                        prev.includes(lang.code)
                          ? prev.filter(l => l !== lang.code)
                          : [...prev, lang.code]
                      );
                    }}
                  />
                  {lang.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={voiceEnabled}
              onChange={() => setVoiceEnabled(!voiceEnabled)}
            />
            Voice Enabled
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={adaptiveEnabled}
              onChange={() => setAdaptiveEnabled(!adaptiveEnabled)}
            />
            Adaptive Logic
          </label>
        </div>

        <button
          onClick={handleGenerateSurvey}
          className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Survey'}
        </button>
      </div>
    </div>
  );
};

export default SurveyBuilder;