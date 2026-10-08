from typing import Optional
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


class JobStatus(str, Enum):
    PENDING = "PENDING"
    PROCESSING_DOCUMENT = "PROCESSING_DOCUMENT"
    SUMMARIZING = "SUMMARIZING"
    SYNTHESIZING_VOICE = "SYNTHESIZING_VOICE"
    RENDERING_VIDEO = "RENDERING_VIDEO"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class Job(BaseModel):
    job_id: str
    username: str
    filename: Optional[str] = "document.pdf"
    status: JobStatus = JobStatus.PENDING
    style: Optional[str] = "subway"  # subway, minecraft, slime
    voice: Optional[str] = "Matthew"  # Matthew, Joanna, Brian
    pdf_s3_key: Optional[str] = None
    prompt_text: Optional[str] = None
    input_type: Optional[str] = "pdf"  # pdf, prompt
    audio_s3_key: Optional[str] = None
    video_s3_key: Optional[str] = None
    video_url: Optional[str] = None
    summary_text: Optional[str] = None
    speech_marks: Optional[list] = None
    error_message: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)


class Video(BaseModel):
    video_id: str
    username: Optional[str] = ""
    video_url: str
    title: Optional[str] = "Study Summary"
    description: Optional[str] = ""
    created_at: Optional[str] = None
    style: Optional[str] = "subway"


class VideoUpdateRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
