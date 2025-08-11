import { useState } from 'react';

interface Question {
  id: number;
  question: string;
  type: string;
  options?: string[];
}

interface Survey {
  success?: boolean;
  questions: Question[];
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SurveyInterface = () => {
  const [promptData, setPromptData] = useState<string>('');
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateSurvey = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/survey`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptData }),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data: Survey = await response.json();
      if (data.success) {
        setSurvey(data);
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

      {/* Generate Button */}
      <button
        onClick={handleGenerateSurvey}
        className={`w-full py-3 rounded-lg font-semibold transition duration-200 ${
          loading
            ? 'bg-blue-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
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
          <ul className="space-y-4">
            {survey.questions.map((q: Question) => (
              <li
                key={q.id}
                className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm"
              >
                <p className="font-medium">
                  <span className="text-blue-600">Q{q.id}:</span> {q.question}{' '}
                  <span className="text-sm text-gray-500">({q.type})</span>
                </p>
                {q.options && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {q.options.map((opt: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-gray-700"
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
