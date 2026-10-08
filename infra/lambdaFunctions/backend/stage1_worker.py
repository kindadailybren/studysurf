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

            # Start asynchronous Polly task to output MP3 into S3
            polly_task, _ = polly_service.gen_audio(
                summary_text, voice_id=voice, job_id=job_id
            )
            task_id = polly_task.get("SynthesisTask", {}).get("TaskId", "")

            # Generate synchronous word-level speech marks for animated caption timing
            speech_marks = polly_service.gen_speech_marks(summary_text, voice_id=voice)

            # Store speech marks and audio prefix in DynamoDB
            expected_audio_key = f"audio/{job_id}/{task_id}.mp3"
            db_job.updateJobStatus(
                job_id,
                username,
                JobStatus.SYNTHESIZING_VOICE.value,
                audio_s3_key=expected_audio_key,
                summary_text=summary_text,
            )

            # Also persist speech marks into DynamoDB job item for Stage 2 worker
            table_name = db_job.table
            dynamodb_client = boto3.client("dynamodb", region_name=region)
            dynamodb_client.update_item(
                TableName=table_name,
                Key={
                    "PK": {"S": f"USER#{username}"},
                    "SK": {"S": f"JOB#{job_id}"},
                },
                UpdateExpression="SET speechMarks = :sm, pollyTaskId = :tid",
                ExpressionAttributeValues={
                    ":sm": {"S": json.dumps(speech_marks)},
                    ":tid": {"S": task_id},
                },
            )

            print(
                f"[SUCCESS] Stage 1 completed for job {job_id}. Polly task {task_id} initiated."
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
