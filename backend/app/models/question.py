from sqlalchemy import (
    Column, Integer, String, Text, ForeignKey,
    JSON, Boolean
)
from sqlalchemy.orm import relationship
from app.database import Base  # <--- USE ABSOLUTE IMPORT

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    survey_id = Column(Integer, ForeignKey("surveys.id", ondelete="CASCADE"), nullable=False)
    question_text = Column(Text, nullable=False)
    question_type = Column(String(50), default="text")          # text, radio, checkbox, etc.
    options = Column(JSON, default=list)                        # array of choices/options
    validation_rules = Column(JSON, default=dict)               # validation, conditional logic
    order_index = Column(Integer, default=0)
    is_mandatory = Column(Boolean, default=False)
    translations = Column(JSON, default=dict)                   # {lang: {text, options}}
    nss_code = Column(String(50), nullable=True)
    lgd_location_type = Column(String(50), nullable=True)

    # --- EXTRA FEATURES FULLY INCLUDED ---
    audio_file_uri = Column(String(255), nullable=True)         # voice/audio reference for question
    voice_enabled = Column(Boolean, default=False)              # audio support for question/option
    audio_metadata = Column(JSON, default=dict)                 # e.g. duration, formats, etc

    adaptive_enabled = Column(Boolean, default=True)            # adaptive/branching logic supported
    adaptive_config = Column(JSON, default=dict)                # config for adaptive branching

    ai_generated = Column(Boolean, default=False)               # LLM-generated flag
    ai_metadata = Column(JSON, default=dict)                    # prompt/context for LLM gen

    # Relationships
    survey = relationship("Survey", back_populates="questions")
    responses = relationship(
        "Response",
        back_populates="question",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
