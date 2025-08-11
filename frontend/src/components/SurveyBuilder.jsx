import React, { useState } from 'react';
import axios from 'axios';

const SurveyBuilder = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prompt, setPrompt] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const handleGenerateSurvey = async () => {
  if (!title || !description || !prompt) {
    alert('Please fill in all fields');
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
      }
    );

    setQuestions(response.data.questions || []);
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

      {/* Title */}
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
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            {questions.map((q, idx) => (
              <li key={idx}>{q}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SurveyBuilder;
