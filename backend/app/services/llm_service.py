import os
import json
from ast import literal_eval
import openai
from dotenv import load_dotenv
from openai import InvalidRequestError, OpenAIError   # <-- Import here

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_questions(prompt: str, num_questions: int = 5):
    try:
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
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
                max_tokens=1000
            )
            model_used = "gpt-4"
        except InvalidRequestError:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
                max_tokens=1000
            )
            model_used = "gpt-3.5-turbo"

        content = response['choices'][0]['message']['content'].strip()

        # Try parsing the content as JSON
        try:
            questions = json.loads(content)
        except json.JSONDecodeError:
            try:
                questions = literal_eval(content)
            except Exception:
                raise ValueError("Invalid JSON format from LLM")

        # Validate basic format
        if not isinstance(questions, list) or not all(isinstance(q, dict) and "text" in q and "type" in q for q in questions):
            raise ValueError("Invalid question format")

        # EXTEND every question dict with extra features for your schema/model
        for q in questions:
            q["translations"] = {}
            q["audio_file_uri"] = None
            q["voice_enabled"] = False
            q["audio_metadata"] = {}
            q["adaptive_enabled"] = True
            q["adaptive_config"] = {}
            q["ai_generated"] = True
            q["ai_metadata"] = { "model": model_used }

        return questions

    except OpenAIError as oe:
        print(f"OpenAI API error: {oe}")
        # fallback default with all extra fields
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
                "ai_metadata": { "model": "default" }
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
                "ai_metadata": { "model": "default" }
            }
        ]
    except Exception as e:
        print(f"Error generating questions from LLM: {e}")
        # fallback default with all extra fields
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
                "ai_metadata": { "model": "default" }
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
                "ai_metadata": { "model": "default" }
            }
        ]
