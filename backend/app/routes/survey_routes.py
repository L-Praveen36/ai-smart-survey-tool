from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional, List, Dict, Any
from pydantic import BaseModel

from app.database import get_db
from app.models.survey import Survey
from app.models.question import Question
from app.models.response import Response
from app.schemas import SurveyCreateRequest, SurveyResponse, AdaptiveQuestionResponse
from app.services import nss_service, llm_service, analytics_service

router = APIRouter()

# --------- Request & Response Models ---------
class QuestionResult(BaseModel):
    id: int
    text: str
    type: str
    options: List[str] = []
    ai_generated: bool = True
    voice_enabled: bool = False
    adaptive_enabled: bool = True
    translations: Dict[str, str] = {}

class SurveyPromptPayload(BaseModel):
    prompt: str
    num_questions: int = 5
    survey_title: str = "AI Survey"
    survey_description: str = "Generated using LLM"
    languages: Optional[List[str]] = ["en"]
    translations: Optional[Dict[str, str]] = {}
    adaptive_enabled: bool = True
    adaptive_config: Dict[str, Any] = {}
    voice_enabled: bool = True
    audio_metadata: Dict[str, Any] = {}
    ai_generated: bool = True
    ai_metadata: Dict[str, Any] = {}

class SurveyPromptResult(BaseModel):
    survey_id: int
    title: str
    description: str
    questions: List[QuestionResult]

# --------- AI Generate Survey from Prompt ---------
@router.post("/generate-from-prompt", response_model=SurveyPromptResult)
def generate_from_prompt(payload: SurveyPromptPayload, db: Session = Depends(get_db)) -> SurveyPromptResult:
    try:
        questions = llm_service.generate_questions(
            prompt=payload.prompt,
            num_questions=payload.num_questions
        )

        survey = Survey(
            title=payload.survey_title,
            description=payload.survey_description,
            survey_type="ai_generated",
            languages=payload.languages,
            translations=payload.translations,
            adaptive_enabled=payload.adaptive_enabled,
            adaptive_config=payload.adaptive_config,
            voice_enabled=payload.voice_enabled,
            audio_metadata=payload.audio_metadata,
            ai_generated=True,
            ai_metadata=payload.ai_metadata,
            status="draft"
        )
        db.add(survey)
        db.commit()
        db.refresh(survey)

        saved_questions = []
        for idx, q in enumerate(questions):
            question = Question(
                survey_id=survey.id,
                question_text=q.get("text", ""),
                question_type=q.get("type", "text"),
                options=q.get("options", []),
                order_index=idx + 1,
                is_mandatory=True,
                translations=q.get("translations", {}),
                audio_file_uri=q.get("audio_file_uri"),
                voice_enabled=q.get("voice_enabled", False),
                audio_metadata=q.get("audio_metadata", {}),
                adaptive_enabled=q.get("adaptive_enabled", True),
                adaptive_config=q.get("adaptive_config", {}),
                ai_generated=q.get("ai_generated", True),
                ai_metadata=q.get("ai_metadata", {})
            )
            db.add(question)
            # Always provide a full question object for frontend
            saved_questions.append({
                "id": idx + 1,
                "text": q.get("text", ""),
                "type": q.get("type", ""),
                "options": q.get("options", []),
                "ai_generated": q.get("ai_generated", True),
                "voice_enabled": q.get("voice_enabled", False),
                "adaptive_enabled": q.get("adaptive_enabled", True),
                "translations": q.get("translations", {}),
            })
        db.commit()

        return SurveyPromptResult(
            survey_id=survey.id,
            title=survey.title,
            description=survey.description,
            questions=saved_questions,
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"LLM-based survey generation failed: {str(e)}")
