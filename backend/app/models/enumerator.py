from sqlalchemy import Column, Integer, ForeignKey, String, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class EnumeratorAssignment(Base):
    __tablename__ = "enumerator_assignments"

    id = Column(Integer, primary_key=True, index=True)
    enumerator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    survey_id = Column(Integer, ForeignKey("surveys.id"), nullable=False)

    language = Column(String(10), nullable=True, default="en")
    assignment_notes = Column(String(255), nullable=True)
    assignment_metadata = Column(JSON, default=dict)   # renamed
    adaptive_config = Column(JSON, default=dict)
    audio_profile_uri = Column(String(255), nullable=True)
    ai_metadata = Column(JSON, default=dict)

    enumerator = relationship("User", back_populates="assignments")
    survey = relationship("Survey", back_populates="enumerators")
