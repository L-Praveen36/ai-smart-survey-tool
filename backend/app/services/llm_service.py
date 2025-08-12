import os
import json
from ast import literal_eval
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def fallback_questions():
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
            "ai_generated": True,
            "ai_metadata": {"model": "default"}
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
            "ai_generated": True,
            "ai_metadata": {"model": "default"}
        }
    ]

def generate_questions(prompt: str, num_questions: int = 5):
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

    try:
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
                max_tokens=1000
            )
            model_used = "gpt-4o-mini"
        except Exception:
            response = client.chat.completions.create(
                model="gpt-4.1-nano",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
                max_tokens=1000
            )
            model_used = "gpt-4.1-nano"

        content = response.choices[0].message.content.strip()

        try:
            questions = json.loads(content)
        except json.JSONDecodeError:
            questions = literal_eval(content)

        if not isinstance(questions, list) or not all(isinstance(q, dict) and "text" in q and "type" in q for q in questions):
            raise ValueError("Invalid question format")

        for q in questions:
            q.setdefault("translations", {})
            q.setdefault("audio_file_uri", None)
            q.setdefault("voice_enabled", False)
            q.setdefault("audio_metadata", {})
            q.setdefault("adaptive_enabled", True)
            q.setdefault("adaptive_config", {})
            q["ai_generated"] = True
            q["ai_metadata"] = {"model": model_used}

        return questions

    except Exception as e:
        error_str = str(e).lower()
        if "quota" in error_str or "insufficient_quota" in error_str or "429" in error_str:
            print("OpenAI API quota exceeded or rate limit hit:", e)
            return fallback_questions()
        else:
            print("OpenAI API error:", e)
            return fallback_questions()
