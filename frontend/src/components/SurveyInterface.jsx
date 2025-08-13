import React from 'react';
import copy from 'copy-to-clipboard';
import { jsPDF } from 'jspdf'; // Import jsPDF

const SurveyInterface = ({ survey, onBack }) => {
  const [selectedLang, setSelectedLang] = React.useState(survey.languages?.[0] || 'en');
  const [answers, setAnswers] = React.useState({});
  const [copySuccess, setCopySuccess] = React.useState(false);

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const getQuestionText = (question) => {
    return question.translations?.[selectedLang] || question.text;
  };

  const handleCopyToClipboard = () => {
    if (survey) {
      copy(JSON.stringify(survey, null, 2));
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleDownloadSurvey = () => {
    if (survey) {
      const doc = new jsPDF();
      let y = 20;

      doc.setFontSize(20);
      doc.text(survey.title || 'Survey Form', 20, y);
      y += 10;
      doc.setFontSize(12);
      doc.text(survey.description || '', 20, y);
      y += 20;

      survey.questions?.forEach((question) => {
        doc.setFontSize(14);
        doc.text(`Q${question.id}: ${getQuestionText(question)}`, 20, y);
        y += 10;

        if (question.type === 'multiple_choice' || question.type === 'checkbox' || question.type === 'yes_no') {
          question.options?.forEach((option) => {
            doc.setFontSize(12);
            doc.text(`- ${option}`, 30, y);
            y += 7;
          });
        } else if (question.type === 'text') {
          doc.setFontSize(12);
          doc.text('Answer:', 30, y);
          y += 7;
        }
        y += 5;
      });

      doc.save(`survey_${survey.title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{survey.title || 'Generated Survey'}</h2>
        {onBack && (
          <button
            onClick={onBack}
            className="text-blue-600 hover:underline"
          >
            ← Back to Generator
          </button>
        )}
      </div>

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
            <div className="flex items-start gap-2 mb-3">
              <span className="font-bold">Q{question.id}:</span>
              <span className="flex-1">{getQuestionText(question)}</span>
              {question.ai_generated && (
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  AI
                </span>
              )}
            </div>

            {question.type === 'multiple_choice' && (
              <div className="space-y-2">
                {question.options?.map((option, i) => (
                  <label key={i} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`q${question.id}`}
                      checked={answers[question.id] === option}
                      onChange={() => handleAnswerChange(question.id, option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}

            {question.type === 'checkbox' && (
              <div className="space-y-2">
                {question.options?.map((option, i) => (
                  <label key={i} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={answers[question.id]?.includes(option)}
                      onChange={(e) => {
                        const newValue = e.target.checked
                          ? [...(answers[question.id] || []), option]
                          : (answers[question.id] || []).filter(v => v !== option);
                        handleAnswerChange(question.id, newValue);
                      }}
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}

            {question.type === 'text' && (
              <textarea
                className="w-full p-2 border rounded"
                rows={3}
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              />
            )}

            {question.type === 'yes_no' && (
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`q${question.id}`}
                    value="yes"
                    checked={answers[question.id] === 'yes'}
                    onChange={() => handleAnswerChange(question.id, 'yes')}
                  />
                  Yes
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`q${question.id}`}
                    value="no"
                    checked={answers[question.id] === 'no'}
                    onChange={() => handleAnswerChange(question.id, 'no')}
                  />
                  No
                </label>
              </div>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={handleCopyToClipboard}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Copy
      </button>
      {copySuccess && (
        <p className="text-green-500 mt-2">Copied to clipboard!</p>
      )}
      <button
        onClick={handleDownloadSurvey}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Download
      </button>
    </div>
  );
};

export default SurveyInterface;