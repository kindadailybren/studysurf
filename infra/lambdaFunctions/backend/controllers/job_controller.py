import os
import json
import uuid
import boto3
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from pydantic import BaseModel

from models.base import Job, JobStatus
from services.AWS.dynamodb_service import AWS_DynamoDB_Job, AWS_DynamoDB_Video
from services.AWS.s3_service import AWS_S3

job_router = APIRouter()


class UploadUrlRequest(BaseModel):
    filename: str
    contentType: Optional[str] = "application/pdf"


class CreateJobRequest(BaseModel):
    job_id: str
    username: str
    filename: Optional[str] = "document.pdf"
    style: Optional[str] = "subway"
    voice: Optional[str] = "Matthew"
    s3_key: str


@job_router.post("/jobs/upload-url")
async def get_presigned_upload_url(
    payload: UploadUrlRequest,
    s3: AWS_S3 = Depends(AWS_S3),
):
    try:
        job_id = str(uuid.uuid4())
        safe_filename = payload.filename.replace(" ", "_")
        key = f"uploads/{job_id}-{safe_filename}"
        content_type = payload.contentType or "application/pdf"

        upload_url = s3.generatePresignedUploadUrl(
            key=key, content_type=content_type, expiration=900
        )

        return {
            "job_id": job_id,
            "s3_key": key,
            "upload_url": upload_url,
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to generate upload URL: {str(e)}"
        )


@job_router.post("/jobs")
async def create_job(
    payload: CreateJobRequest,
    db_job: AWS_DynamoDB_Job = Depends(AWS_DynamoDB_Job),
):
    try:
        job = Job(
            job_id=payload.job_id,
            username=payload.username,
            filename=payload.filename,
            status=JobStatus.PENDING,
            style=payload.style or "subway",
            voice=payload.voice or "Matthew",
            pdf_s3_key=payload.s3_key,
        )

        # 1. Save initial job in DynamoDB
        db_job.createJob(job)

        # 2. Push message to SQS Ingestion Queue
        queue_url = os.environ.get("INGESTION_QUEUE_URL")
        if queue_url:
            region = os.environ.get("AWS_REGION", "ap-southeast-1")
            sqs = boto3.client("sqs", region_name=region)
            message_payload = {
                "job_id": job.job_id,
                "username": job.username,
                "filename": job.filename,
                "style": job.style,
                "voice": job.voice,
                "pdf_s3_key": job.pdf_s3_key,
            }
            sqs.send_message(
                QueueUrl=queue_url,
                MessageBody=json.dumps(message_payload),
            )
        else:
            print("[WARN] INGESTION_QUEUE_URL not configured in environment.")

        return {
            "job_id": job.job_id,
            "status": JobStatus.PENDING.value,
            "message": "Job successfully queued for processing.",
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to queue job: {str(e)}")


def resolve_media_url(raw_url: Optional[str], s3: AWS_S3) -> Optional[str]:
    if not raw_url:
        return raw_url
    cf_domain = os.environ.get("CLOUDFRONT_DOMAIN")
    if "output-videos/" in raw_url:
        key = "output-videos/" + raw_url.split("output-videos/")[1].split("?")[0]
        if cf_domain:
            return f"https://{cf_domain}/{key}"
        return s3.generatePresignedDownloadUrl(key, expiration=604800)
    return raw_url


@job_router.get("/jobs/{job_id}")
async def get_job_status(
    job_id: str,
    username: Optional[str] = Query(None),
    db_job: AWS_DynamoDB_Job = Depends(AWS_DynamoDB_Job),
    s3: AWS_S3 = Depends(AWS_S3),
):
    job = None
    if username:
        job = db_job.getJob(job_id=job_id, username=username)

    if not job:
        job = db_job.getJobByIdGSI(job_id=job_id)

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if job.get("video_url"):
        job["video_url"] = resolve_media_url(job["video_url"], s3)

    return job


@job_router.get("/jobs")
async def list_user_jobs(
    username: str = Query(...),
    db_job: AWS_DynamoDB_Job = Depends(AWS_DynamoDB_Job),
    s3: AWS_S3 = Depends(AWS_S3),
):
    jobs = db_job.listJobs(username=username)
    for job in jobs:
        if isinstance(job, dict) and job.get("video_url"):
            job["video_url"] = resolve_media_url(job["video_url"], s3)
    return jobs


@job_router.get("/videos")
async def list_user_videos(
    username: str = Query(...),
    db_video: AWS_DynamoDB_Video = Depends(AWS_DynamoDB_Video),
    s3: AWS_S3 = Depends(AWS_S3),
):
    videos = db_video.retrieveVideoFromDb(username=username)
    for video in videos:
        if isinstance(video, dict) and video.get("video_url"):
            video["video_url"] = resolve_media_url(video["video_url"], s3)
    return videos
