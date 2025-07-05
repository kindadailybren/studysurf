import json
import boto3
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from usecases.genvid_usecase import extract_text_pymupdf


genvid_router = APIRouter()


@genvid_router.get("/hello")
async def hello():
    return {"message": "Hello World"}


@genvid_router.post("/genvid")
async def generate_video(request: Request):
    bedrock_runtime = boto3.client("bedrock-runtime", region_name="ap-southeast-1")
    polly = boto3.client("polly", region_name="ap-southeast-1")
    try:
        body = await request.body()

        text = extract_text_pymupdf(body)

        if not text.strip():
            raise ValueError("No text found in the PDF")

        prompt = (
            text.strip()
            + "\nSummarize this whole topic in one straight paragraph for a college student trying to understand it.\
                Don't say anything like 'Here is a summary.'"
        )

        payload = {
            "modelId": "anthropic.claude-3-haiku-20240307-v1:0",
            "contentType": "application/json",
            "accept": "*/*",
            "body": json.dumps(
                {
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": 1000,
                    "temperature": 0.7,
                    "anthropic_version": "bedrock-2023-05-31",
                }
            ),
        }

        response = bedrock_runtime.invoke_model(**payload)
        response_body = json.loads(response.get("body").read())

        texttospeech = response_body["content"][0]["text"]

        response = polly.start_speech_synthesis_task(
            Engine="neural",
            OutputFormat="mp3",
            OutputS3BucketName="polly-practice-bren",
            OutputS3KeyPrefix="voice/",
            Text=texttospeech,
            VoiceId="Matthew",
        )

        return JSONResponse(
            content={
                "answer": texttospeech,
                "input_tokens": response_body["usage"]["input_tokens"],
                "output_tokens": response_body["usage"]["output_tokens"],
                "s3_audio_uri": response["SynthesisTask"]["OutputUri"],
                "task_status": response["SynthesisTask"]["TaskStatus"],
            }
        )

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
