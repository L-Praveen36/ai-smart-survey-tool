import React, { useState } from 'react';
import { generateSurveyFromPrompt } from '../services/api';

const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' }
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

  const handleGenerateSurvey = async () => {
    if (!title.trim() || !description.trim() || !prompt.trim() || languages.length === 0) {
      alert('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const qns = await generateSurveyFromPrompt({
        prompt,
        numQuestions,
        surveyTitle: title,
        surveyDescription: description,
        languages,
        voiceEnabled,
        adaptiveEnabled
      });
      console.log("Questions from API:", qns);
      setQuestions(qns);
    } catch (err) {
      console.error(err);
      alert('Survey generation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-xl rounded-2xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">🧠 AI Survey Builder</h2>

      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Survey Title" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <input value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="AI Prompt" />
      <input type="number" value={numQuestions} min={1} max={20} onChange={(e) => setNumQuestions(Number(e.target.value))} />

      {/* Languages */}
      {LANGUAGE_OPTIONS.map((lang) => (
        <label key={lang.code}>
          <input type="checkbox" checked={languages.includes(lang.code)}
            onChange={() => {
              setLanguages(prev => prev.includes(lang.code)
                ? prev.filter(l => l !== lang.code)
                : [...prev, lang.code]);
            }} /> {lang.label}
        </label>
      ))}

      <button onClick={handleGenerateSurvey} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Survey'}
      </button>

      {questions.length > 0 && (
        <div>
          <h3>Generated Questions:</h3>
          <ul>
            {questions.map((q, idx) => (
              <li key={idx}>
                <strong>{q?.translations?.[languages[0]] || q?.text || q?.question_text}</strong>
                {q.options?.length > 0 && <div>Options: {q.options.join(', ')}</div>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SurveyBuilder;
