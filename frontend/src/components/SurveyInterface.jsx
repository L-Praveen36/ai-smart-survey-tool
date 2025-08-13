import React from 'react';

const SurveyInterface = ({ survey, onBack, onSaveSurvey }) => {
  const [selectedLang, setSelectedLang] = React.useState(survey.languages?.[0] || 'en');
  const [answers, setAnswers] = React.useState({});
  const [isSaving, setIsSaving] = React.useState(false);

  // Handle answer changes
  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  // Copy survey to clipboard
  const handleCopySurvey = () => {
    const surveyText = formatSurveyForExport();
    navigator.clipboard.writeText(surveyText)
      .then(() => alert('Survey copied to clipboard!'))
      .catch(() => alert('Failed to copy survey'));
  };

  // Download survey as JSON file
  const handleDownloadSurvey = () => {
    const surveyData = {
      ...survey,
      answers,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(surveyData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `survey_${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Save survey to backend
  const handleSaveSurvey = async () => {
    setIsSaving(true);
    try {
      await onSaveSurvey({
        ...survey,
        answers
      });
      alert('Survey saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save survey');
    } finally {
      setIsSaving(false);
    }
  };

  // Format survey for text export
  const formatSurveyForExport = () => {
    let text = `Survey: ${survey.title || 'Untitled Survey'}\n\n`;
    survey.questions.forEach(q => {
      text += `Q${q.id}: ${q.text}\n`;
      if (q.options) {
        text += `Options: ${q.options.join(', ')}\n`;
      }
      text += `Answer: ${answers[q.id] || 'Not answered'}\n\n`;
    });
    return text;
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{survey.title || 'Generated Survey'}</h2>
        <div className="flex gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              ← Back
            </button>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={handleCopySurvey}
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
        >
          📋 Copy Survey
        </button>
        
        <button
          onClick={handleDownloadSurvey}
          className="px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200"
        >
          ⬇️ Download JSON
        </button>
        
        {onSaveSurvey && (
          <button
            onClick={handleSaveSurvey}
            disabled={isSaving}
            className="px-4 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : '💾 Save Survey'}
          </button>
        )}
      </div>

      {/* Survey Content */}
      {survey.languages?.length > 1 && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Language</label>
          <select
            className="p-2 border rounded"
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
          >
            {survey.languages.map(lang => (
              <option key={lang} value={lang}>
                {LANGUAGE_OPTIONS.find(l => l.code === lang)?.label || lang}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="space-y-6">
        {survey.questions?.map((question) => (
          <div key={question.id} className="border-b pb-4">
            {/* Question rendering remains the same */}
            {/* ... */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SurveyInterface;