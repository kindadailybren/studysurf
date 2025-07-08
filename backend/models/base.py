from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
from typing import Optional, Dict, Any
from enum import Enum
import uuid


class SubscriptionTier(str, Enum):
    FREE = "free"
    PREMIUM = "premium"
    ENTERPRISE = "enterprise"


class User(BaseModel):
    user_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: EmailStr
    subscription_tier: SubscriptionTier = SubscriptionTier.FREE
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)


class Video(BaseModel):
    video_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str  # Foreign key to User

    # Generated assets
    audio_s3_uri: Optional[str] = None
    audio_duration_seconds: Optional[float] = None

    # Voice settings used
    voice_settings: Optional[Dict[str, Any]] = None

    # Timestamps
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    # Metadata
    tags: Optional[list] = Field(default_factory=list)
    is_public: bool = False
