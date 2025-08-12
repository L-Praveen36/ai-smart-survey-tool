import os
import json
from ast import literal_eval
from openai import OpenAI
from dotenv import load_dotenv

# Load .env config for your API key
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def fallback_questions(model_name="default"):
    """Return static fallback survey questions for demo or when all models fail."""
    return [
        {
            "text": "Default Question 1",
            "type": "text",
            "translations": {},
            "audio_file_uri": None,
            "voice_enabled": False,
            "audio_metadata": {},
            "adaptive_enabled": True,
            "adaptive_config": {},
            "ai_generated": False,
            "ai_metadata": {"model": model_name, "error": "Fallback triggered."}
        },
        {
            "text": "Default Question 2",
            "type": "radio",
            "options": ["Yes", "No"],
            "translations": {},
            "audio_file_uri": None,
            "voice_enabled": False,
            "audio_metadata": {},
            "adaptive_enabled": True,
            "adaptive_config": {},
            "ai_generated": False,
            "ai_metadata": {"model": model_name, "error": "Fallback triggered."}
        }
    ]

def generate_questions(prompt: str, num_questions: int = 5):
    """Generate AI survey questions with automatic fallback across preferred OpenAI models."""
    system_prompt = (
        "You are a survey expert. Generate well-structured, diverse, and clear survey questions "
        "based on the provided topic. Respond ONLY with a valid JSON list."
    )
    user_prompt = (
        f"Topic: {prompt}\n\n"
        f"Generate {num_questions} concise survey questions in this exact JSON format:\n"
        "[\n"
        "  {\"text\": \"Question 1?\", \"type\": \"text\"},\n"
        "  {\"text\": \"Question 2?\", \"type\": \"radio\", \"options\": [\"Yes\", \"No\"]}\n"
        "]\n\n"
        "Rules:\n"
        "- 'type' can only be 'text', 'radio', or 'checkbox'\n"
        "- Include 'options' only if type is 'radio' or 'checkbox'\n"
        "- Do NOT include any extra text outside the JSON"
    )

    # Model fallback order; edit as needed to match your API access
    models_to_try = ["gpt-4o-mini", "gpt-4.1-mini", "gpt-4.1-nano"]

    for model_name in models_to_try:
        try:
            response = client.chat.completions.create(
                model=model_name,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
                max_tokens=1000
            )
            content = response.choices[0].message.content.strip()

            # Parse the output as JSON (safe fallback literal_eval for very rare cases)
            try:
                questions = json.loads(content)
            except json.JSONDecodeError:
                questions = literal_eval(content)

            # Format validity: must be a list of dicts, each with "text" and "type"
            if not isinstance(questions, list) or not all(isinstance(q, dict) and "text" in q and "type" in q for q in questions):
                raise ValueError("Invalid question format")

            # Add extra schema fields for frontend/db
            for q in questions:
                q.setdefault("translations", {})
                q.setdefault("audio_file_uri", None)
                q.setdefault("voice_enabled", False)
                q.setdefault("audio_metadata", {})
                q.setdefault("adaptive_enabled", True)
                q.setdefault("adaptive_config", {})
                q["ai_generated"] = True
                q["ai_metadata"] = {"model": model_name}

            return questions

        except Exception as e:
            print(f"[WARN] Model {model_name} failed: {e}")
            continue  # Try the next model in the fallback order

    # If all models fail, serve fallback static questions
    print("[ERROR] All GPT models failed or unavailable; using fallback questions.")
    return fallback_questions(model_name="none")
