# backend/app/schemas.py

from typing import List, Optional, Dict, Any
from pydantic import BaseModel

# --------------------------
# Survey Creation
# --------------------------
class SurveyCreateRequest(BaseModel):
    title: str
    description: Optional[str] = None
    survey_type: str
    nss_template_type: Optional[str] = None
    languages: List[str] = ["en"]
    translations: Optional[Dict[str, str]] = {}              # Multilingual
    adaptive_enabled: bool = True
    adaptive_config: Optional[Dict[str, Any]] = {}
    voice_enabled: bool = False
    audio_metadata: Optional[Dict[str, Any]] = {}
    ai_generated: bool = False
    ai_metadata: Optional[Dict[str, Any]] = {}
    status: Optional[str] = "draft"

    class Config:
        from_attributes = True

# --------------------------
# Question Schema
# --------------------------
class QuestionSchema(BaseModel):
    id: int
    question_text: str
    question_type: str
    options: Optional[List[Any]] = []
    order_index: int
    is_mandatory: bool
    translations: Optional[Dict[str, Any]] = {}
    audio_file_uri: Optional[str] = None
    voice_enabled: bool = False
    audio_metadata: Optional[Dict[str, Any]] = {}
    adaptive_enabled: bool = True
    adaptive_config: Optional[Dict[str, Any]] = {}
    ai_generated: bool = False
    ai_metadata: Optional[Dict[str, Any]] = {}

    class Config:
        from_attributes = True

# --------------------------
# Survey Response
# --------------------------
class SurveyResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    survey_type: str
    nss_template_type: Optional[str] = None
    languages: List[str]
    translations: Optional[Dict[str, str]] = {}
    adaptive_enabled: bool
    adaptive_config: Optional[Dict[str, Any]] = {}
    voice_enabled: bool
    audio_metadata: Optional[Dict[str, Any]] = {}
    ai_generated: bool = False
    ai_metadata: Optional[Dict[str, Any]] = {}
    status: str
    questions: List[QuestionSchema] = []

    class Config:
        from_attributes = True

# --------------------------
# Adaptive Question Response
# --------------------------
class AdaptiveQuestionResponse(BaseModel):
    question_id: int
    question_text: str
    question_type: str
    options: List[Any] = []
    order_index: int
    completed: bool = False
    translations: Optional[Dict[str, Any]] = {}
    audio_file_uri: Optional[str] = None
    voice_enabled: bool = False
    audio_metadata: Optional[Dict[str, Any]] = {}
    adaptive_enabled: bool = True
    adaptive_config: Optional[Dict[str, Any]] = {}
    ai_generated: bool = False
    ai_metadata: Optional[Dict[str, Any]] = {}

    class Config:
        from_attributes = True

# --------------------------
# Submit Response (Request + Result)
# --------------------------
class SubmitResponseRequest(BaseModel):
    survey_id: int
    question_id: int
    respondent_id: str
    answer: Any  # Can be text, choice id, list, dict, etc.
    confidence_score: Optional[int] = 100
    validation_status: Optional[str] = "pending"
    extra_metadata: Optional[dict] = {}
    language: Optional[str] = "en"
    translations: Optional[Dict[str, Any]] = {}
    audio_file_uri: Optional[str] = None
    voice_enabled: bool = False
    audio_metadata: Optional[Dict[str, Any]] = {}
    adaptive_data: Optional[Dict[str, Any]] = {}
    ai_context: Optional[Dict[str, Any]] = {}

    class Config:
        from_attributes = True

class SubmitResponseResult(BaseModel):
    response_id: int
    survey_id: int
    question_id: int
    respondent_id: str
    validation_status: str
    message: str
    language: Optional[str] = "en"
    audio_file_uri: Optional[str] = None
    voice_enabled: bool = False
    adaptive_data: Optional[Dict[str, Any]] = {}
    ai_context: Optional[Dict[str, Any]] = {}

    class Config:
        from_attributes = True
