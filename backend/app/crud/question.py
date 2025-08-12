from sqlalchemy.orm import Session
from app.models.survey import Survey
from app.schemas import SurveyCreate
from typing import List, Optional

def create_survey(db: Session, survey: SurveyCreate) -> Survey:
    db_survey = Survey(
        title=survey.title,
        description=survey.description,
        created_by=getattr(survey, "created_by", None),
        survey_type=getattr(survey, "survey_type", None),
        nss_template_type=getattr(survey, "nss_template_type", None),
        languages=getattr(survey, "languages", ["en"]),
        adaptive_enabled=getattr(survey, "adaptive_enabled", True),
        voice_enabled=getattr(survey, "voice_enabled", False),
        status=getattr(survey, "status", "draft"),
        # ----- For extensibility! -----
        translations=getattr(survey, "translations", {}),   # For multilingual forms
        ai_generated=getattr(survey, "ai_generated", False), # If AI generated
        adaptive_config=getattr(survey, "adaptive_config", {}), # Any adaptive survey logic
        audio_metadata=getattr(survey, "audio_metadata", None), # For audio/voice info
        # Add any new fields you need for future features...
    )
    db.add(db_survey)
    db.commit()
    db.refresh(db_survey)
    return db_survey

def get_survey(db: Session, survey_id: int) -> Optional[Survey]:
    return db.query(Survey).filter(Survey.id == survey_id).first()

def list_surveys(db: Session, skip: int = 0, limit: int = 100) -> List[Survey]:
    return db.query(Survey).offset(skip).limit(limit).all()
