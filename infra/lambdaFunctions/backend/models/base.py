from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
from enum import Enum


class SubscriptionTier(str, Enum):
    FREE = "free"
    PREMIUM = "premium"
    ENTERPRISE = "enterprise"


class User(BaseModel):
    user_id: str
    username: str
    email: EmailStr
    subscription_tier: SubscriptionTier = SubscriptionTier.FREE
    created_at: datetime = Field(default_factory=datetime.now)
    confirmed: bool = False


class Video(BaseModel):
    video_id: str
    username: str
    video_url: str
