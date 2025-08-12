const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function generateSurveyFromPrompt({ prompt, numQuestions, surveyTitle, surveyDescription }) {
  const payload = {
    prompt,
    num_questions: numQuestions,      // matches FastAPI schema
    survey_title: surveyTitle,
    survey_description: surveyDescription
  };

  const response = await fetch(`${API_BASE_URL}/api/surveys/generate-from-prompt`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Failed to generate survey: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}
