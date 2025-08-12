from sqlalchemy.orm import Session
from app.models.response import Response
from app.schemas import ResponseCreate
from typing import List, Optional

def create_response(db: Session, resp: ResponseCreate) -> Response:
    db_resp = Response(
        survey_id=getattr(resp, "survey_id", None),
        question_id=resp.question_id,
        user_id=getattr(resp, "user_id", None),
        respondent_id=getattr(resp, "respondent_id", ""),
        answer=resp.answer,
        confidence_score=getattr(resp, "confidence_score", 100),       # Adaptive, scoring
        validation_status=getattr(resp, "validation_status", "pending"),
        extra_metadata=getattr(resp, "extra_metadata", {}),            # Multilingual, AI, context
        audio_file_uri=getattr(resp, "audio_file_uri", None),          # Voice/audio support
        language=getattr(resp, "language", "en"),                     # Multilingual support
        # Add future extension fields here:
        # ai_metadata=getattr(resp, "ai_metadata", None),
        # adaptive_data=getattr(resp, "adaptive_data", {}),
    )
    db.add(db_resp)
    db.commit()
    db.refresh(db_resp)
    return db_resp

def list_responses_for_survey(db: Session, survey_id: int, language: Optional[str] = None) -> List[Response]:
    query = db.query(Response).filter(Response.survey_id == survey_id)
    if language:
        query = query.filter(Response.language == language)  # Filter for multilingual
    return query.all()
