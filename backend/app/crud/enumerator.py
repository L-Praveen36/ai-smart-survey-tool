from sqlalchemy.orm import Session
from app.models.enumerator import EnumeratorAssignment
from app.schemas import EnumeratorAssignmentCreate
from typing import Optional, List

def assign_enumerator(
    db: Session,
    assignment: EnumeratorAssignmentCreate
) -> EnumeratorAssignment:
    db_assign = EnumeratorAssignment(
        enumerator_id=assignment.enumerator_id,
        survey_id=assignment.survey_id,
        # --- Expandable fields for advanced features ---
        # For multilingual surveys:
        language=getattr(assignment, "language", None),
        # For assignment notes/metadata:
        assignment_notes=getattr(assignment, "assignment_notes", None),
        metadata=getattr(assignment, "metadata", None),
        # For adaptive logic:
        adaptive_config=getattr(assignment, "adaptive_config", None),
        # For voice/audio features (e.g. training audio, identification):
        audio_profile_uri=getattr(assignment, "audio_profile_uri", None)
        # ^ Only add these if your schema/model supports them!
    )
    db.add(db_assign)
    db.commit()
    db.refresh(db_assign)
    return db_assign

def list_assignments(
    db: Session,
    enumerator_id: Optional[int] = None,
    language: Optional[str] = None  # for multilingual support
) -> List[EnumeratorAssignment]:
    query = db.query(EnumeratorAssignment)
    if enumerator_id is not None:
        query = query.filter(EnumeratorAssignment.enumerator_id == enumerator_id)
    if language is not None:
        query = query.filter(EnumeratorAssignment.language == language)
    # You can add more filters for adaptive/voice features
    return query.all()
