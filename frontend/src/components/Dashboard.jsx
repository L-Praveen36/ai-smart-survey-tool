import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Use environment variable for base API URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LANG_DEFAULT = 'en';

const Dashboard = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLang, setSelectedLang] = useState(LANG_DEFAULT);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/surveys`);
      setSurveys(response.data || []);
    } catch (error) {
      console.error('Failed to fetch surveys:', error);
      alert('Could not load surveys');
    } finally {
      setLoading(false);
    }
  };

  // Handles language switch
  const handleLanguageChange = (e) => setSelectedLang(e.target.value);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-4xl font-bold text-gray-800 text-center mb-8">
        📊 Dashboard
      </h2>
      {/* Language Picker (if surveys support multilingual) */}
      {surveys.some(s => s.languages && s.languages.length > 1) && (
        <div className="mb-5 flex justify-center">
          <label className="mr-3 text-gray-700 font-medium">Language:</label>
          <select
            value={selectedLang}
            onChange={handleLanguageChange}
            className="border rounded px-3 py-1"
          >
            {Array.from(
              new Set(
                surveys.flatMap(s => (s.languages ? s.languages : [LANG_DEFAULT]))
              )
            ).map(lang => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-500 italic">Loading surveys...</p>
      ) : surveys.length === 0 ? (
        <p className="text-center text-gray-500 italic">No surveys found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {surveys.map((survey) => (
            <div
              key={survey.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:scale-[1.02] transition-transform duration-200 ease-in-out"
            >
              <div className="flex items-center mb-1">
                <h3 className="text-xl font-semibold text-blue-600 mr-2">
                  {(survey.translations?.[selectedLang] || survey.title)}
                </h3>
                {survey.ai_generated && (
                  <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded ml-2">
                    🤖 AI
                  </span>
                )}
                {survey.voice_enabled && (
                  <span className="bg-teal-100 text-teal-700 text-xs px-2 py-1 rounded ml-2">
                    🎙️ Voice
                  </span>
                )}
                {survey.adaptive_enabled && (
                  <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded ml-2">
                    ⚡ Adaptive
                  </span>
                )}
              </div>
              <p className="text-gray-700 mb-4">{survey.description}</p>

              {survey.questions && survey.questions.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Questions:</h4>
                  <ul className="list-decimal pl-6 text-gray-600 space-y-1">
                    {survey.questions.map((q, i) => (
                      <li key={i} className="flex items-center">
                        {/* Multilingual question text */}
                        {(q.translations?.[selectedLang] || q.question_text)}
                        {/* Feature badges */}
                        {q.ai_generated && (
                          <span className="ml-2 bg-purple-50 text-purple-600 px-1 rounded text-xs">🤖</span>
                        )}
                        {q.voice_enabled && (
                          <span className="ml-2 bg-teal-50 text-teal-600 px-1 rounded text-xs">🎙️</span>
                        )}
                        {q.adaptive_enabled && (
                          <span className="ml-2 bg-yellow-50 text-yellow-600 px-1 rounded text-xs">⚡</span>
                        )}
                        {/* Show options if multiple choice */}
                        {(q.options && q.options.length > 0) && (
                          <span className="ml-3 text-gray-400 text-xs">
                            [Options: {q.options.join(', ')}]
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* -- You could add an "Analytics" or "Take Survey" button here -- */}

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
