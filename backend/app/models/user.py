from sqlalchemy import Column, Integer, String, Enum, JSON
from sqlalchemy.orm import relationship
from app.database import Base
import enum

class UserRole(str, enum.Enum):
    admin = "admin"
    enumerator = "enumerator"
    participant = "participant"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.participant)

    # Multilingual support
    preferred_language = Column(String(10), default="en")       # user's preferred language

    # Voice/Audio features
    audio_profile_uri = Column(String(255), nullable=True)      # user's audio/voice profile (URI)
    voice_enabled = Column(Integer, default=0)                  # 0 = disabled, 1 = enabled
    audio_metadata = Column(JSON, default=dict)                 # any audio-related metadata

    # Adaptive Logic
    adaptive_profile = Column(JSON, default=dict)               # adaptive survey settings for user

    # AI Features
    ai_flags = Column(JSON, default=dict)                       # dict to store AI-specific flags/settings
    user_metadata = Column(JSON, default=dict)                  # any extra user metadata/context

    # Relationship: assignments for enumerators
    assignments = relationship(
        "EnumeratorAssignment",
        back_populates="enumerator",
        cascade="all, delete-orphan"
    )

    # Relationship: surveys created by this user
    surveys_created = relationship("Survey", back_populates="creator")
