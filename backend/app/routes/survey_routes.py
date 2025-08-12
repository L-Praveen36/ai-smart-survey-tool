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

# --------- QuestionResponse Model ---------
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

# --------- Request Models ---------
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
    questions: List[QuestionResponse]

# --------- Create Survey (Manual) ---------
@router.post("/", response_model=SurveyResponse)
def create_survey(payload: SurveyCreateRequest, db: Session = Depends(get_db)) -> SurveyResponse:
    try:
        new_survey = Survey(
            title=payload.title,
            description=payload.description,
            survey_type=payload.survey_type,
            nss_template_type=payload.nss_template_type,
            languages=payload.languages or ["en"],
            translations=getattr(payload, "translations", {}) or {},
            adaptive_enabled=payload.adaptive_enabled,
            adaptive_config=getattr(payload, "adaptive_config", {}) or {},
            voice_enabled=payload.voice_enabled,
            audio_metadata=getattr(payload, "audio_metadata", {}) or {},
            ai_generated=getattr(payload, "ai_generated", False),
            ai_metadata=getattr(payload, "ai_metadata", {}) or {},
            status=payload.status or "draft",
        )
        db.add(new_survey)
        db.commit()
        db.refresh(new_survey)

        # If it's an NSS template, pre-fill with template questions
        if payload.survey_type == "nss" and payload.nss_template_type:
            nss_questions = nss_service.get_questions_from_template(payload.nss_template_type)
            for q in nss_questions:
                question = Question(
                    survey_id=new_survey.id,
                    question_text=q["question_text"],
                    question_type=q.get("question_type", "text"),
                    options=q.get("options", []),
                    validation_rules=q.get("validation_rules", {}),
                    nss_code=q.get("nss_code"),
                    lgd_location_type=q.get("lgd_location_type"),
                    translations=q.get("translations", {}),
                    order_index=q.get("order_index", 0),
                    is_mandatory=q.get("is_mandatory", False),
                    audio_file_uri=q.get("audio_file_uri"),
                    voice_enabled=q.get("voice_enabled", False),
                    audio_metadata=q.get("audio_metadata", {}),
                    adaptive_enabled=q.get("adaptive_enabled", True),
                    adaptive_config=q.get("adaptive_config", {}),
                    ai_generated=q.get("ai_generated", False),
                    ai_metadata=q.get("ai_metadata", {}),
                )
                db.add(question)
            db.commit()

        return new_survey
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Survey creation failed: {str(e)}")

# --------- Get Survey by ID ---------
@router.get("/{survey_id}", response_model=SurveyResponse)
def get_survey(survey_id: int, db: Session = Depends(get_db)) -> SurveyResponse:
    survey = db.query(Survey).filter(Survey.id == survey_id).first()
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")
    return survey

# --------- AI Generate Survey from Prompt ---------
@router.post("/generate-from-prompt", response_model=SurveyPromptResult)
def generate_from_prompt(payload: SurveyPromptPayload, db: Session = Depends(get_db)) -> SurveyPromptResult:
    try:
        questions = llm_service.generate_questions(
            prompt=payload.prompt,
            num_questions=payload.num_questions,
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
            status="draft",
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
                ai_metadata=q.get("ai_metadata", {}),
            )
            db.add(question)
            # Append full QuestionResponse object for frontend
            saved_questions.append(QuestionResponse(**q))

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

# --------- Adaptive Question Logic ---------
@router.get("/{survey_id}/adaptive", response_model=AdaptiveQuestionResponse)
def get_next_adaptive_question(
    survey_id: int,
    respondent_id: str = Query(...),
    language: str = Query("en"),
    db: Session = Depends(get_db),
) -> AdaptiveQuestionResponse:
    try:
        question = analytics_service.get_next_adaptive_question(survey_id, respondent_id, language, db)
        if question:
            return question
        return {"message": "Survey completed", "completed": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Adaptive logic failed: {str(e)}")

# --------- Get Progress ---------
@router.get("/{survey_id}/progress")
def get_survey_progress(survey_id: int, respondent_id: str, db: Session = Depends(get_db)) -> Dict[str, Any]:
    try:
        total = db.query(Question).filter_by(survey_id=survey_id).count()
        answered = db.query(Response).filter_by(survey_id=survey_id, respondent_id=respondent_id).count()
        percent = round((answered / total) * 100, 2) if total > 0 else 0
        return {
            "survey_id": survey_id,
            "respondent_id": respondent_id,
            "answered_questions": answered,
            "total_questions": total,
            "completion_percentage": percent,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching progress: {str(e)}")
