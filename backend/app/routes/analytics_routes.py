from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.services import analytics_service

router = APIRouter()

@router.get(
    "/survey/{survey_id}",
    response_model=dict  # Consider a Pydantic schema if analytics are big!
)
def get_survey_analytics(
    survey_id: int,
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    language: Optional[str] = Query(None, description="Filter by language"),                 # Multilingual analytics
    voice_enabled: Optional[bool] = Query(None, description="Filter by voice/audio surveys"),# Voice/audio analytics
    adaptive_enabled: Optional[bool] = Query(None, description="Filter by adaptive logic"),  # Adaptive analytics
    ai_generated: Optional[bool] = Query(None, description="Filter by AI/LLM-generated surveys"), # AI analytics
    db: Session = Depends(get_db)
) -> dict:
    """
    Get analytics for a specific survey, with advanced feature filters.
    """
    try:
        analytics = analytics_service.generate_survey_analytics(
            survey_id=survey_id,
            db=db,
            start_date=start_date,
            end_date=end_date,
            language=language,
            voice_enabled=voice_enabled,
            adaptive_enabled=adaptive_enabled,
            ai_generated=ai_generated
        )
        return analytics
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get analytics: {str(e)}")
