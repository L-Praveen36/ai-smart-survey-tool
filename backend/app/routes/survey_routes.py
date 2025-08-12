from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import Optional, List, Dict, Any
from pydantic import BaseModel

from app.database import get_db
from app.models.survey import Survey
from app.models.question import Question
from app.services import llm_service

router = APIRouter()


class SurveyPromptPayload(BaseModel):
    prompt: str
    num_questions: int = 5
    survey_title: str
    survey_description: str
    languages: Optional[List[str]] = ["en"]
    translations: Optional[Dict[str, str]] = {}
    adaptive_enabled: bool = True
    adaptive_config: Dict[str, Any] = {}
    voice_enabled: bool = True
    audio_metadata: Dict[str, Any] = {}
    ai_generated: bool = True
    ai_metadata: Dict[str, Any] = {}


class QuestionResponse(BaseModel):
    text: str
    type: Optional[str] = "text"
    options: Optional[List[str]] = []
    translations: Optional[Dict[str, str]] = {}
    audio_file_uri: Optional[str] = None
    voice_enabled: Optional[bool] = False
    audio_metadata: Optional[Dict[str, Any]] = {}
    adaptive_enabled: Optional[bool] = True
    adaptive_config: Optional[Dict[str, Any]] = {}
    ai_generated: Optional[bool] = True
    ai_metadata: Optional[Dict[str, Any]] = {}


class SurveyPromptResult(BaseModel):
    survey_id: int
    title: str
    description: str
    questions: List[QuestionResponse]


@router.post("/generate-from-prompt", response_model=SurveyPromptResult)
def generate_from_prompt(payload: SurveyPromptPayload, db: Session = Depends(get_db)) -> SurveyPromptResult:
    try:
        # Ask the LLM to generate questions
        questions = llm_service.generate_questions(
            prompt=payload.prompt,
            num_questions=payload.num_questions,
        )

        # Create the survey
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
            status="draft",
        )
        db.add(survey)
        db.commit()
        db.refresh(survey)

        # Save and prepare return data
        saved_questions: List[QuestionResponse] = []
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
                ai_metadata=q.get("ai_metadata", {}),
            )
            db.add(question)

            saved_questions.append(
                QuestionResponse(
                    text=q.get("text") or q.get("question_text") or "",
                    type=q.get("type", "text"),
                    options=q.get("options", []),
                    translations=q.get("translations", {}),
                    audio_file_uri=q.get("audio_file_uri"),
                    voice_enabled=q.get("voice_enabled", False),
                    audio_metadata=q.get("audio_metadata", {}),
                    adaptive_enabled=q.get("adaptive_enabled", True),
                    adaptive_config=q.get("adaptive_config", {}),
                    ai_generated=q.get("ai_generated", True),
                    ai_metadata=q.get("ai_metadata", {})
                )
            )

        db.commit()

        return SurveyPromptResult(
            survey_id=survey.id,
            title=survey.title,
            description=survey.description,
            questions=saved_questions
        )

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
