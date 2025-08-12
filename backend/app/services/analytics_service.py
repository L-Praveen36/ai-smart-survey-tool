from typing import Optional
from sqlalchemy.orm import Session
from app.models import Question, Response
from app.schemas import AdaptiveQuestionResponse

def get_next_adaptive_question(
    survey_id: int, respondent_id: str, language: str, db: Session
) -> Optional[AdaptiveQuestionResponse]:
    try:
        # Fetch already answered question IDs for this respondent
        answered_qs = (
            db.query(Response.question_id)
            .filter(
                Response.survey_id == survey_id,
                Response.respondent_id == respondent_id,
            )
            .distinct()
            .all()
        )
        answered_ids = {q[0] for q in answered_qs}

        # Get next unanswered question ordered by order_index
        next_q = (
            db.query(Question)
            .filter(Question.survey_id == survey_id)
            .filter(~Question.id.in_(answered_ids))
            .order_by(Question.order_index)
            .first()
        )

        if not next_q:
            return None  # All questions answered

        # Multilingual question text
        question_text = (
            next_q.translations.get(language, next_q.question_text)
            if getattr(next_q, "translations", None)
            else next_q.question_text
        )

        # Build response with all features
        return AdaptiveQuestionResponse(
            question_id=next_q.id,
            question_text=question_text,
            question_type=next_q.question_type,
            options=next_q.options or [],
            order_index=next_q.order_index,
            completed=False,
            translations=next_q.translations,
            audio_file_uri=next_q.audio_file_uri,
            voice_enabled=next_q.voice_enabled,
            audio_metadata=next_q.audio_metadata,
            adaptive_enabled=next_q.adaptive_enabled,
            adaptive_config=next_q.adaptive_config,
            ai_generated=next_q.ai_generated,
            ai_metadata=next_q.ai_metadata,
        )

    except Exception as e:
        raise Exception(f"Adaptive question fetch failed: {str(e)}")
