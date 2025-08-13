const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function generateSurveyFromPrompt({
  prompt,
  numQuestions,
  surveyTitle,
  surveyDescription,
  languages = ['en'],
  voiceEnabled = false,
  adaptiveEnabled = true,
  aiGenerated = true
}) {
  const payload = {
    prompt,
    num_questions: numQuestions,
    survey_title: surveyTitle,
    survey_description: surveyDescription,
    languages,
    voice_enabled: voiceEnabled,
    adaptive_enabled: adaptiveEnabled,
    ai_generated: aiGenerated
  };

  const response = await fetch(`${API_BASE_URL}/api/surveys/generate-from-prompt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Failed to generate survey: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data; // <-- Return the full survey object, not just questions
}
