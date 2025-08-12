from sqlalchemy import Column, Integer, String, ForeignKey, JSON, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base  # Use absolute import!

class Response(Base):
    __tablename__ = "responses"

    id = Column(Integer, primary_key=True, index=True)
    survey_id = Column(Integer, ForeignKey("surveys.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    respondent_id = Column(String(100), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    answer = Column(JSON, nullable=True)
    confidence_score = Column(Integer, default=100)
    validation_status = Column(String(50), default="pending")
    extra_metadata = Column(JSON, default=dict)    # custom metadata, analytics, tracking
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Multilingual support
    language = Column(String(10), default="en")
    translations = Column(JSON, default=dict)      # translated responses if needed

    # Audio/Voice features
    audio_file_uri = Column(String(255), nullable=True)  # URI to recorded response
    voice_enabled = Column(Integer, default=0)           # 0=False, 1=True
    audio_metadata = Column(JSON, default=dict)           # duration, format, etc.

    # Adaptive logic
    adaptive_data = Column(JSON, default=dict)           # Data for adaptive question flow

    # AI-integration
    ai_context = Column(JSON, default=dict)              # LLM-related metadata

    # Relationships
    question = relationship("Question", back_populates="responses")
    user = relationship("User", foreign_keys=[user_id])
    survey = relationship("Survey")  # Direct link to survey
