import { useState } from 'react';

// Define types for survey data
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ promptData }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

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
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded-lg shadow bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">AI Survey Generator</h2>

      <textarea
        className="w-full p-3 border rounded mb-4"
        rows={4}
        placeholder="Enter prompt or description for your survey..."
        value={promptData}
        onChange={(e) => setPromptData(e.target.value)}
      />

      <button
        onClick={handleGenerateSurvey}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Survey'}
      </button>

      {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

      {survey && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Generated Survey</h3>
          <ul className="space-y-3">
            {survey.questions.map((q: Question) => (
              <li key={q.id} className="p-3 border rounded bg-gray-50">
                <strong>Q{q.id}:</strong> {q.question} ({q.type})
                {q.options && (
                  <ul className="ml-6 list-disc mt-1">
                    {q.options.map((opt: string, idx: number) => (
                      <li key={idx}>{opt}</li>
                    ))}
                  </ul>
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
