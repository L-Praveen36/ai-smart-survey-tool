const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Generates a survey from prompt and extra features.
 * 
 * @param {{
 *   prompt: string,
 *   numQuestions: number,
 *   surveyTitle: string,
 *   surveyDescription: string,
 *   languages?: string[],          // e.g., ['en', 'hi', ...]
 *   voiceEnabled?: boolean,
 *   adaptiveEnabled?: boolean,
 *   aiGenerated?: boolean
 * }} params 
 */
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
    languages,          // matches backend for multilingual surveys
    voice_enabled: voiceEnabled,
    adaptive_enabled: adaptiveEnabled,
    ai_generated: aiGenerated
    // Add more fields here if backend/extensions require (e.g. audio_metadata)
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
