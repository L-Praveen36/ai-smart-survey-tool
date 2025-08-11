import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/surveys');
      setSurveys(response.data || []);
    } catch (error) {
      console.error('Failed to fetch surveys:', error);
      alert('Could not load surveys');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-4xl font-bold text-gray-800 text-center mb-8">
        📊 Dashboard
      </h2>

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
              <h3 className="text-xl font-semibold text-blue-600 mb-2">
                {survey.title}
              </h3>
              <p className="text-gray-700 mb-4">{survey.description}</p>

              {survey.questions && survey.questions.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Questions:</h4>
                  <ul className="list-decimal pl-6 text-gray-600 space-y-1">
                    {survey.questions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
