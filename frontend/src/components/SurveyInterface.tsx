import React, { useState } from 'react';

export interface SurveyInterfaceProps {
  selectedLang?: string;
  aiEnabled?: boolean;
  voiceEnabled?: boolean;
  adaptiveEnabled?: boolean;
  onLanguageChange?: (lang: string) => void;
}

interface Question {
  id: number;
  question: string;
  type: string;
  options?: string[];
  ai_generated?: boolean;
  voice_enabled?: boolean;
  adaptive_enabled?: boolean;
  translations?: Record<string, string>;
}

interface Survey {
  success?: boolean;
  questions: Question[];
  languages?: string[];
  voice_enabled?: boolean;
  adaptive_enabled?: boolean;
  ai_generated?: boolean;
}

const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  // Add more as needed!
];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SurveyInterface: React.FC<SurveyInterfaceProps> = ({
  selectedLang: initialLang = 'en',
  aiEnabled = true,
  voiceEnabled = true,
  adaptiveEnabled = true,
  onLanguageChange
}) => {
  const [promptData, setPromptData] = useState<string>('');
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [languages, setLanguages] = useState<string[]>([initialLang]);
  const [voiceChecked, setVoiceChecked] = useState<boolean>(voiceEnabled);
  const [adaptiveChecked, setAdaptiveChecked] = useState<boolean>(adaptiveEnabled);
  const [selectedLang, setSelectedLang] = useState<string>(initialLang);

  const handleGenerateSurvey = async () => {
    if (!promptData.trim()) {
      alert("Please enter a prompt before generating the survey.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/surveys/generate-from-prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptData,
          num_questions: numQuestions,
          languages,
          voice_enabled: voiceChecked,
          adaptive_enabled: adaptiveChecked,
          ai_generated: aiEnabled
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data: Survey = await response.json();
      if (data.success !== false && data.questions) {
        setSurvey(data);
        if (data.languages?.length) setSelectedLang(data.languages[0]);
      } else {
        setError('Survey generation failed.');
      }
    } catch (err) {
      console.error('Survey generation failed:', err);
      setError('Survey generation failed. Please check the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageSelect = (lang: string) => {
    setSelectedLang(lang);
    if (onLanguageChange) onLanguageChange(lang);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border border-gray-200 rounded-xl shadow-lg bg-white">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
        🧠 AI Survey Generator
      </h2>

      {/* Prompt Input */}
      <textarea
        className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={4}
        placeholder="Enter a prompt or description for your survey..."
        value={promptData}
        onChange={(e) => setPromptData(e.target.value)}
      />

      {/* Number of Questions + Language Picker */}
      <div className="mb-4 flex flex-col md:flex-row gap-4">
        <label className="flex-1 text-sm font-semibold text-gray-700">
          Number of Questions
          <input
            type="number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mt-2"
            value={numQuestions}
            min={1}
            max={20}
            onChange={e => setNumQuestions(Number(e.target.value))}
          />
        </label>

        <label className="flex-1 text-sm font-semibold text-gray-700">
          Survey Languages
          <div className="mt-2 flex gap-2 flex-wrap">
            {LANGUAGE_OPTIONS.map((lang) => (
              <label key={lang.code} className="flex gap-1 items-center">
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
        </label>
      </div>

      {/* Feature Toggles (controlled by props) */}
      <div className="mb-4 flex gap-8">
        {voiceEnabled && (
          <label className="flex gap-2 items-center text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={voiceChecked}
              onChange={() => setVoiceChecked(val => !val)}
              className="accent-blue-600"
            />
            Voice/Audio Enabled
          </label>
        )}
        {adaptiveEnabled && (
          <label className="flex gap-2 items-center text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={adaptiveChecked}
              onChange={() => setAdaptiveChecked(val => !val)}
              className="accent-yellow-500"
            />
            Adaptive Logic
          </label>
        )}
      </div>

      <button
        onClick={handleGenerateSurvey}
        className={`w-full py-3 rounded-lg font-semibold transition duration-200 ${
          loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Survey'}
      </button>

      {/* Error */}
      {error && <p className="mt-4 text-red-500 text-center font-medium">{error}</p>}

      {/* Generated Survey */}
      {survey && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            📋 Generated Survey
          </h3>
          {survey.languages && survey.languages.length > 1 && (
            <div className="mb-3 flex gap-4 items-center">
              <span className="font-sm text-gray-600">Display Language:</span>
              <select
                value={selectedLang}
                onChange={e => handleLanguageSelect(e.target.value)}
                className="border px-2 py-1 rounded"
              >
                {survey.languages.map((lang: string) => (
                  <option key={lang} value={lang}>
                    {LANGUAGE_OPTIONS.find(l => l.code === lang)?.label || lang.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          )}
          <ul className="space-y-4">
            {survey.questions.map((q: Question) => (
              <li
                key={q.id}
                className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm"
              >
                <div className="flex gap-2 items-center font-medium">
                  <span className="text-blue-600 font-bold">Q{q.id}:</span>
                  <span>
                    {(q.translations && q.translations[selectedLang])
                      ? q.translations[selectedLang]
                      : q.question}
                  </span>
                  {/* Feature badges */}
                  {q.ai_generated && (
                    <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-bold">🤖 AI</span>
                  )}
                  {q.voice_enabled && (
                    <span className="bg-teal-100 text-teal-700 px-2 py-0.5 rounded text-xs font-bold">🎙️ Voice</span>
                  )}
                  {q.adaptive_enabled && (
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs font-bold">⚡ Adaptive</span>
                  )}
                  {q.type && (
                    <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">
                      {q.type}
                    </span>
                  )}
                </div>
                {q.options && q.options.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2 text-gray-700">
                    {q.options.map((opt: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm"
                      >
                        {opt}
                      </span>
                    ))}
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

export default SurveyInterface;