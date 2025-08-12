import React, { useState } from 'react';
import axios from 'axios';

const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  // add more
];

const SurveyBuilder = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prompt, setPrompt] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [languages, setLanguages] = useState(['en']);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [adaptiveEnabled, setAdaptiveEnabled] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleGenerateSurvey = async () => {
    if (!title.trim() || !description.trim() || !prompt.trim() || languages.length === 0) {
      alert('Please fill in all fields and select at least one language.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/surveys/generate-from-prompt`,
        {
          prompt,
          num_questions: numQuestions,
          survey_title: title,
          survey_description: description,
          languages,
          voice_enabled: voiceEnabled,
          adaptive_enabled: adaptiveEnabled,
          ai_generated: true,
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const data = response.data;
      let generatedQuestions = [];

      // If API returns a plain object or array
      if (Array.isArray(data)) {
        generatedQuestions = data;
      } else if (Array.isArray(data.questions)) {
        generatedQuestions = data.questions;
      }

      // Always convert string to object for display
      generatedQuestions = generatedQuestions.map((q, idx) => {
        if (typeof q === 'string') {
          return {
            question_text: q,
            type: '',
            options: [],
            ai_generated: true,
            voice_enabled: voiceEnabled,
            adaptive_enabled: adaptiveEnabled,
            translations: {}
          };
        }
        return {
          question_text: q.question_text || q.text || '',
          translations: q.translations || {},
          ai_generated: q.ai_generated ?? true,
          voice_enabled: q.voice_enabled ?? voiceEnabled,
          adaptive_enabled: q.adaptive_enabled ?? adaptiveEnabled,
          type: q.type || q.question_type || '',
          options: q.options || []
        };
      });

      if (generatedQuestions.length > 0) {
        setQuestions(generatedQuestions);
      } else {
        alert('No questions generated. Please check your prompt.');
      }
    } catch (error) {
      console.error('Error generating survey:', error);
      alert('Survey generation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-xl rounded-2xl mt-6 border border-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
        🧠 AI Survey Builder
      </h2>
      {/* --- Form Controls omitted for brevity --- */}
      {/* ... */}

      {/* Generate Button */}
      <button
        onClick={handleGenerateSurvey}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Survey'}
      </button>

      {/* Generated Questions */}
      {questions.length > 0 && (
        <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-3 text-gray-800">📝 Generated Questions:</h3>
          <ul className="space-y-3">
            {questions.map((q, idx) => (
              <li key={idx} className="bg-white p-3 rounded-md shadow-sm border flex flex-col">
                <span className="font-bold text-blue-700 mb-1">
                  {q.translations && q.translations[languages[0]]
                    ? q.translations[languages[0]]
                    : q.question_text}
                </span>
                <div className="flex gap-2 items-center mb-1">
                  {q.ai_generated && <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-bold">🤖 AI</span>}
                  {q.voice_enabled && <span className="bg-teal-100 text-teal-700 px-2 py-0.5 rounded text-xs font-bold">🎙️ Voice</span>}
                  {q.adaptive_enabled && <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs font-bold">⚡ Adaptive</span>}
                  {q.type && <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">{q.type}</span>}
                </div>
                {q.options && q.options.length > 0 && (
                  <div className="text-sm text-gray-600">Options: {q.options.join(', ')}</div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SurveyBuilder;
