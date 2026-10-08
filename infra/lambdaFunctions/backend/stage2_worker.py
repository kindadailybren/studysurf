import os
import json
import uuid
import boto3
from utils.genvid_utils.moviepy_service import MoviePy
from services.AWS.dynamodb_service import AWS_DynamoDB_Job, AWS_DynamoDB_Video
from services.AWS.s3_service import AWS_S3
from models.base import JobStatus, Video


def handler(event, context):
    print(f"[INFO] Stage 2 Worker received event: {json.dumps(event)}")

    db_job = AWS_DynamoDB_Job()
    db_video = AWS_DynamoDB_Video()
    s3_service = AWS_S3()
    moviepy_service = MoviePy()
    region = os.environ.get("AWS_REGION", "ap-southeast-1")

    for record in event.get("Records", []):
        job_id = None
        username = None
        local_audio_path = None
        local_bg_path = None
        output_video_path = None

        try:
            body = json.loads(record.get("body", "{}"))

            # Check if this is an EventBridge event forwarded from Amazon Polly
            if body.get("source") == "aws.polly" or "detail" in body:
                detail = body.get("detail", {})
                task_id = detail.get("taskId")
                output_uri = detail.get("outputUri", "")
                task_status = detail.get("taskStatus", "COMPLETED")

                if task_status != "COMPLETED":
                    print(f"[WARN] Polly task not completed (status: {task_status})")
                    continue

                # Extract job_id from outputUri (e.g., .../audio/{job_id}/...mp3)
                parts = output_uri.split("audio/")
                if len(parts) > 1:
                    job_id = parts[1].split("/")[0]
            else:
                job_id = body.get("job_id")
                username = body.get("username")

            if not job_id:
                print(f"[WARN] Could not determine job_id from record: {body}")
                continue

            # Look up job details from DynamoDB
            job = None
            if username:
                job = db_job.getJob(job_id, username)
            if not job:
                job = db_job.getJobByIdGSI(job_id)

            if not job:
                print(f"[ERROR] Job {job_id} not found in DynamoDB.")
                continue

            username = job.get("username") or username
            filename = job.get("filename", "document.pdf")
            style = job.get("style") or body.get("style", "subway")
            summary_text = job.get("summary_text", "")
            audio_s3_key = job.get("audio_s3_key") or body.get("audio_s3_key") or f"audio/{job_id}.mp3"

            # Parse speech marks stored in DynamoDB
            dynamodb_client = boto3.client("dynamodb", region_name=region)
            ddb_item = dynamodb_client.get_item(
                TableName=db_job.table,
                Key={
                    "PK": {"S": f"USER#{username}"},
                    "SK": {"S": f"JOB#{job_id}"},
                },
            ).get("Item", {})

            speech_marks = []
            if "speechMarks" in ddb_item:
                try:
                    speech_marks = json.loads(ddb_item["speechMarks"]["S"])
                except Exception as e:
                    print(f"[WARN] Failed to parse speech marks: {e}")

            # 1. Update status: RENDERING_VIDEO
            db_job.updateJobStatus(job_id, username, JobStatus.RENDERING_VIDEO.value)
            print(f"[INFO] Rendering video for job {job_id} ({username})")

            # 2. Download generated speech MP3
            local_audio_path = s3_service.grabAudioFroms3(audio_s3_key)
            if not local_audio_path or not os.path.exists(local_audio_path):
                raise FileNotFoundError(f"Could not download audio from {audio_s3_key}")

            # 3. Download background template video
            local_bg_path = s3_service.grabBackgroundVideoFromS3(style)
            if not local_bg_path or not os.path.exists(local_bg_path):
                raise FileNotFoundError(f"Could not load background video for style '{style}'")

            # 4. Generate Composite Video with animated subtitles
            output_filename = f"{job_id}.mp4"
            video_input = {
                "filename": output_filename,
                "bgVidLocalPath": local_bg_path,
                "audioLocalPath": local_audio_path,
                "speechMarks": speech_marks,
                "summary_text": summary_text,
                "font_size": 60,
                "font_color": "white",
                "stroke_color": "black",
                "stroke_width": 6,
                "bg_color": "black",
                "position": "center",
            }

            output_video_path = moviepy_service.generate_video_with_text(video_input)

            # 5. Upload final MP4 to S3
            video_s3_key = f"output-videos/{job_id}.mp4"
            video_url = s3_service.uploadVideo(output_video_path, custom_key=video_s3_key)
            if not video_url:
                raise RuntimeError("Failed to upload final video to S3.")

            # 6. Mark Job COMPLETED in DynamoDB
            db_job.updateJobStatus(
                job_id,
                username,
                JobStatus.COMPLETED.value,
                video_url=video_url,
            )

            # 7. Add Video to user's gallery table record
            clean_title = filename.replace(".pdf", "").replace("_", " ").title()
            video_record = Video(
                video_id=job_id,
                username=username,
                video_url=video_url,
                title=clean_title,
                style=style,
            )
            db_video.uploadVideoToDb(video_record)

            print(f"[SUCCESS] Video successfully rendered for job {job_id}: {video_url}")

        except Exception as e:
            print(f"[ERROR] Stage 2 video rendering failed: {e}")
            if job_id and username:
                db_job.updateJobStatus(
                    job_id,
                    username,
                    JobStatus.FAILED.value,
                    error_message=str(e),
                )
            raise e

        finally:
            # Clean temporary files from /tmp
            for path in [local_audio_path, local_bg_path, output_video_path]:
                if path and os.path.exists(path) and "/tmp" in path:
                    try:
                        os.remove(path)
                    except Exception:
                        pass

    return {"statusCode": 200, "message": "Stage 2 rendering completed"}
