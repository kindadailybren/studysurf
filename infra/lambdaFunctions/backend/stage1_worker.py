import os
import json
import boto3
from utils.pdf_utils.pdfparse import PDFParser
from services.AWS.bedrock_service import AWS_Bedrock
from services.AWS.polly_service import AWS_Polly
from services.AWS.dynamodb_service import AWS_DynamoDB_Job
from services.AWS.s3_service import AWS_S3
from models.base import JobStatus


def handler(event, context):
    print(f"[INFO] Stage 1 Worker received event: {json.dumps(event)}")

    db_job = AWS_DynamoDB_Job()
    s3_service = AWS_S3()
    bedrock_service = AWS_Bedrock()
    polly_service = AWS_Polly()
    pdf_parser = PDFParser()

    for record in event.get("Records", []):
        try:
            body = json.loads(record.get("body", "{}"))
            job_id = body.get("job_id")
            username = body.get("username")
            pdf_s3_key = body.get("pdf_s3_key")
            style = body.get("style", "subway")
            voice = body.get("voice", "Matthew")

            if not job_id or not username:
                print(f"[WARN] Skipping malformed SQS record: {body}")
                continue

            print(f"[INFO] Processing job {job_id} for user {username}")

            # 1. Update status: PROCESSING_DOCUMENT
            db_job.updateJobStatus(job_id, username, JobStatus.PROCESSING_DOCUMENT.value)

            # 2. Download and parse PDF
            local_pdf_path = f"/tmp/{job_id}.pdf"
            region = os.environ.get("AWS_REGION", "ap-southeast-1")
            s3_client = boto3.client("s3", region_name=region)
            media_bucket = s3_service.mediaBucket

            s3_client.download_file(media_bucket, pdf_s3_key, local_pdf_path)

            extracted_text = pdf_parser.extract_text_util(local_pdf_path)
            if not extracted_text.strip():
                raise ValueError("Could not extract any readable text from uploaded PDF.")

            # Clean local temporary file
            try:
                os.remove(local_pdf_path)
            except Exception:
                pass

            # 3. Update status: SUMMARIZING with Bedrock
            db_job.updateJobStatus(job_id, username, JobStatus.SUMMARIZING.value)
            summary_response = bedrock_service.gen_summarization(extracted_text)
            summary_text = summary_response["content"][0]["text"]

            # 4. Update status: SYNTHESIZING_VOICE with Amazon Polly
            db_job.updateJobStatus(
                job_id,
                username,
                JobStatus.SYNTHESIZING_VOICE.value,
                summary_text=summary_text,
            )

            # Synchronous Polly speech synthesis (~1-2 seconds)
            audio_bytes = polly_service.synthesize_audio_bytes(summary_text, voice_id=voice)

            # Upload audio MP3 directly to S3
            audio_s3_key = f"audio/{job_id}.mp3"
            s3_client.put_object(
                Bucket=media_bucket,
                Key=audio_s3_key,
                Body=audio_bytes,
                ContentType="audio/mpeg",
            )

            # Generate synchronous word-level speech marks for animated caption timing (~1 second)
            speech_marks = polly_service.gen_speech_marks(summary_text, voice_id=voice)

            # Update job in DynamoDB with audio_s3_key and summary_text
            db_job.updateJobStatus(
                job_id,
                username,
                JobStatus.SYNTHESIZING_VOICE.value,
                audio_s3_key=audio_s3_key,
                summary_text=summary_text,
            )

            # Persist speech marks into DynamoDB job item for Stage 2 worker
            table_name = db_job.table
            dynamodb_client = boto3.client("dynamodb", region_name=region)
            dynamodb_client.update_item(
                TableName=table_name,
                Key={
                    "PK": {"S": f"USER#{username}"},
                    "SK": {"S": f"JOB#{job_id}"},
                },
                UpdateExpression="SET speechMarks = :sm, audioS3Key = :akey",
                ExpressionAttributeValues={
                    ":sm": {"S": json.dumps(speech_marks)},
                    ":akey": {"S": audio_s3_key},
                },
            )

            # 5. Direct SQS handoff to Stage 2 Video Render Queue
            render_queue_url = os.environ.get("VIDEO_RENDER_QUEUE_URL")
            if render_queue_url:
                sqs_client = boto3.client("sqs", region_name=region)
                render_payload = {
                    "job_id": job_id,
                    "username": username,
                    "audio_s3_key": audio_s3_key,
                    "style": style,
                }
                sqs_client.send_message(
                    QueueUrl=render_queue_url,
                    MessageBody=json.dumps(render_payload),
                )
                print(
                    f"[SUCCESS] Stage 1 forwarded job {job_id} directly to Video Render Queue."
                )
            else:
                print(
                    f"[WARN] VIDEO_RENDER_QUEUE_URL not configured. SQS forward skipped."
                )

        except Exception as e:
            print(f"[ERROR] Stage 1 worker failed for record: {e}")
            if "job_id" in locals() and "username" in locals() and job_id and username:
                db_job.updateJobStatus(
                    job_id,
                    username,
                    JobStatus.FAILED.value,
                    error_message=str(e),
                )
            raise e

    return {"statusCode": 200, "message": "Stage 1 processing finished"}
