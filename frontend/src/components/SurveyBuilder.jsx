import React, { useState } from 'react';
import axios from 'axios';

// Supported languages
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
    if (
      !title.trim() ||
      !description.trim() ||
      !prompt.trim() ||
      languages.length === 0
    ) {
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
        }
      );

      // Debugging log to inspect the questions received from API
      console.log('QUESTIONS FROM API:', response.data.questions);

      setQuestions(response.data.questions || []);

      if (!response.data.questions || response.data.questions.length === 0) {
        alert('No questions generated. Please check your prompt or backend.');
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

      {/* Survey Title */}
      <div className="mb-5">
        <label className="block text-sm font-semibold mb-1 text-gray-700">
          Survey Title
        </label>
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Customer Satisfaction Survey"
        />
      </div>

      {/* Description */}
      <div className="mb-5">
        <label className="block text-sm font-semibold mb-1 text-gray-700">
          Survey Description
        </label>
        <textarea
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of your survey"
        />
      </div>

      {/* AI Prompt */}
      <div className="mb-5">
        <label className="block text-sm font-semibold mb-1 text-gray-700">
          AI Prompt
        </label>
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Generate questions for an employee engagement survey"
        />
      </div>

      {/* Number of Questions */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-1 text-gray-700">
          Number of Questions
        </label>
        <input
          type="number"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={numQuestions}
          onChange={(e) => setNumQuestions(Number(e.target.value))}
          min={1}
          max={20}
        />
      </div>

      {/* Language Picker */}
      <div className="mb-5">
        <label className="block text-sm font-semibold mb-2 text-gray-700">
          Survey Languages
        </label>
        <div className="flex gap-4 flex-wrap">
          {LANGUAGE_OPTIONS.map((lang) => (
            <label key={lang.code} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={languages.includes(lang.code)}
                onChange={() => {
                  setLanguages((prev) =>
                    prev.includes(lang.code)
                      ? prev.filter((l) => l !== lang.code)
                      : [...prev, lang.code]
                  );
                }}
              />
              <span className="text-sm">{lang.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Voice/Audio Enabled */}
      <div className="mb-4 flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={voiceEnabled}
            onChange={() => setVoiceEnabled((val) => !val)}
            className="accent-blue-600"
          />
          Voice/Audio Enabled
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={adaptiveEnabled}
            onChange={() => setAdaptiveEnabled((val) => !val)}
            className="accent-yellow-500"
          />
          Adaptive Logic
        </label>
      </div>

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
          <h3 className="text-xl font-semibold mb-3 text-gray-800">
            📝 Generated Questions:
          </h3>
          <ul className="space-y-3">
            {questions.map((q, idx) => (
              <li
                key={idx}
                className="bg-white p-3 rounded-md shadow-sm border flex flex-col"
              >
                {/* Always display question text, prefer translation if available */}
                <span className="font-bold text-blue-700 mb-1">
                  {q?.translations?.[languages[0]] ||
                    q?.text ||
                    q?.question_text ||
                    'Question text missing'}
                </span>

                {/* Feature badges */}
                <div className="flex gap-2 items-center mb-1">
                  {q.ai_generated && (
                    <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-bold">
                      🤖 AI
                    </span>
                  )}
                  {q.voice_enabled && (
                    <span className="bg-teal-100 text-teal-700 px-2 py-0.5 rounded text-xs font-bold">
                      🎙️ Voice
                    </span>
                  )}
                  {q.adaptive_enabled && (
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs font-bold">
                      ⚡ Adaptive
                    </span>
                  )}
                  {(q.type || q.question_type) && (
                    <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">
                      {q.type || q.question_type}
                    </span>
                  )}
                </div>

                {/* Options */}
                {q.options && q.options.length > 0 && (
                  <div className="text-sm text-gray-600">
                    Options: {q.options.join(', ')}
                  </div>
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
