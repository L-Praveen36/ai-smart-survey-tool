from sqlalchemy import Column, Integer, ForeignKey, String, JSON
from sqlalchemy.orm import relationship
from app.database import Base  # absolute import is best

class EnumeratorAssignment(Base):
    __tablename__ = "enumerator_assignments"

    id = Column(Integer, primary_key=True, index=True)
    enumerator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    survey_id = Column(Integer, ForeignKey("surveys.id"), nullable=False)

    # Multilingual support: assignment language or target
    language = Column(String(10), nullable=True, default="en")
    # Notes/metadata: allow assignment notes, custom data
    assignment_notes = Column(String(255), nullable=True)
    metadata = Column(JSON, default=dict)
    # Adaptive config: survey logic/config attached to assignment
    adaptive_config = Column(JSON, default=dict)
    # Audio/voice features: for profile, onboarding, etc.
    audio_profile_uri = Column(String(255), nullable=True)
    # AI integration: any AI context, history, prompt metadata
    ai_metadata = Column(JSON, default=dict)

    # Relationships: link to User and Survey objects
    enumerator = relationship("User", back_populates="assignments")
    survey = relationship("Survey", back_populates="enumerators")
