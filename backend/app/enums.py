# backend/app/enums.py
from enum import Enum

class QuestionType(Enum):
    TEXT = "text"
    RADIO = "radio"
    CHECKBOX = "checkbox"
    VOICE = "voice"           # Audio/voice type added
    AI_GENERATED = "ai"       # AI-generated question type
