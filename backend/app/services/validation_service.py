# backend/app/services/validation_service.py

from app.models.question import Question

def validate_answer(question: Question, answer, language: str = "en", audio_file_uri: str = None, ai_context: dict = None):
    try:
        # Check required answer presence
        if question.is_mandatory and (answer is None or answer == ""):
            return "invalid", 0

        # Voice/audio validation: if required but not provided
        if getattr(question, "voice_enabled", False):
            if not audio_file_uri:
                return "invalid", 10
            # Optional: validate audio metadata if present
            if hasattr(question, "audio_metadata") and isinstance(question.audio_metadata, dict):
                # Example: min_duration
                min_dur = question.audio_metadata.get("min_duration")
                if min_dur:
                    received_dur = ai_context.get("audio_duration") if ai_context else None
                    if received_dur and received_dur < min_dur:
                        return "invalid", 25

        # Branch on language: use language-specific options if provided
        options = question.options
        if getattr(question, "translations", None) and language in question.translations:
            trans = question.translations[language]
            options = trans.get("options", options)

        # Type-based validation
        if question.question_type in ("radio", "checkbox"):
            if isinstance(answer, list):
                valid = all(opt in options for opt in answer)
            else:
                valid = answer in options
            if not valid:
                return "invalid", 30

        # Custom rules (including adaptive logic)
        rules = question.validation_rules or {}
        if rules.get("numeric_only") and not str(answer).isdigit():
            return "invalid", 20

        # Adaptive branching logic (forward to next if rule requires it)
        if getattr(question, "adaptive_enabled", False) and question.adaptive_config:
            # Example: check conditional required questions
            target_val = question.adaptive_config.get("required_value")
            if target_val and answer != target_val:
                # Branching: this answer doesn't meet path requirement
                return "invalid", 50

        # AI-based validation rules
        if getattr(question, "ai_generated", False) and ai_context:
            feedback = ai_context.get("validation_feedback")
            if feedback == "low_confidence":
                return "review", 70
            elif feedback == "invalid":
                return "invalid", 40

        # Passed all checks
        return "valid", 100

    except Exception as e:
        print(f"Validation error: {e}")
        return "error", 0
