from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Response
from app.schemas import SubmitResponseRequest, SubmitResponseResult

router = APIRouter(prefix="/responses", tags=["Responses"])

@router.post("/submit", response_model=SubmitResponseResult)
def submit_response(
    payload: SubmitResponseRequest,
    db: Session = Depends(get_db)
) -> SubmitResponseResult:
    try:
        # Check if the respondent has already answered this question
        existing = (
            db.query(Response)
            .filter(
                Response.survey_id == payload.survey_id,
                Response.question_id == payload.question_id,
                Response.respondent_id == payload.respondent_id,
            )
            .first()
        )

        if existing:
            # Update the existing response with all advanced fields
            existing.answer = payload.answer
            existing.confidence_score = payload.confidence_score
            existing.validation_status = payload.validation_status
            existing.extra_metadata = payload.extra_metadata or {}
            existing.language = payload.language
            existing.translations = payload.translations or {}
            existing.audio_file_uri = payload.audio_file_uri
            existing.voice_enabled = payload.voice_enabled
            existing.audio_metadata = payload.audio_metadata or {}
            existing.adaptive_data = payload.adaptive_data or {}
            existing.ai_context = payload.ai_context or {}
            db.commit()
            db.refresh(existing)

            return SubmitResponseResult(
                response_id=existing.id,
                survey_id=existing.survey_id,
                question_id=existing.question_id,
                respondent_id=existing.respondent_id,
                validation_status=existing.validation_status,
                message="Response updated successfully",
                language=existing.language,
                audio_file_uri=existing.audio_file_uri,
                voice_enabled=existing.voice_enabled,
                adaptive_data=existing.adaptive_data,
                ai_context=existing.ai_context,
            )

        # Create a new response record with all advanced fields
        new_response = Response(
            survey_id=payload.survey_id,
            question_id=payload.question_id,
            respondent_id=payload.respondent_id,
            answer=payload.answer,
            confidence_score=payload.confidence_score,
            validation_status=payload.validation_status,
            extra_metadata=payload.extra_metadata or {},
            language=payload.language,
            translations=payload.translations or {},
            audio_file_uri=payload.audio_file_uri,
            voice_enabled=payload.voice_enabled,
            audio_metadata=payload.audio_metadata or {},
            adaptive_data=payload.adaptive_data or {},
            ai_context=payload.ai_context or {},
        )
        db.add(new_response)
        db.commit()
        db.refresh(new_response)

        return SubmitResponseResult(
            response_id=new_response.id,
            survey_id=new_response.survey_id,
            question_id=new_response.question_id,
            respondent_id=new_response.respondent_id,
            validation_status=new_response.validation_status,
            message="Response submitted successfully",
            language=new_response.language,
            audio_file_uri=new_response.audio_file_uri,
            voice_enabled=new_response.voice_enabled,
            adaptive_data=new_response.adaptive_data,
            ai_context=new_response.ai_context,
        )

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error submitting response: {str(e)}")
