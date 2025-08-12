from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas import UserCreate
from app.utils.security import get_password_hash
from typing import Optional

def get_user(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate) -> User:
    hashed = get_password_hash(user.password)
    db_user = User(
        name=user.name,
        email=user.email,
        password_hash=hashed,
        role=getattr(user, "role", "participant"),
        # --- Extensible feature fields ---
        preferred_language=getattr(user, "preferred_language", "en"),      # multilingual user
        audio_profile_uri=getattr(user, "audio_profile_uri", None),        # profile audio, e.g. voice biometrics
        user_metadata=getattr(user, "user_metadata", {}),                  # additional AI, adaptive, or frontend info
        ai_flags=getattr(user, "ai_flags", {}),                            # future AI/recommendation system toggles
        adaptive_profile=getattr(user, "adaptive_profile", {}),            # adaptive UX data (custom, scoring, etc)
        # Add fields here as you expand user features!
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
