from fastapi import Request
from fastapi.responses import JSONResponse
import fitz
import json
import boto3


class GenVidUseCase:
    async def generate_video_usecase(self, request: Request):
        try:
            file = await request.body()
            generatedSummary = gen_summarization(file)
            audioGenerated, textReference = gen_audio(generatedSummary)

            return JSONResponse(
                content={
                    "answer": textReference,
                    "input_tokens": generatedSummary["usage"]["input_tokens"],
                    "output_tokens": generatedSummary["usage"]["output_tokens"],
                    "s3_audio_uri": audioGenerated["SynthesisTask"]["OutputUri"],
                    "task_status": audioGenerated["SynthesisTask"]["TaskStatus"],
                }
            )

        except Exception as e:
            return JSONResponse(status_code=500, content={"error": str(e)})


def gen_summarization(file):
    bedrock_runtime = boto3.client("bedrock-runtime", region_name="ap-southeast-1")

    text = extract_text_pymupdf(file)

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

    return response_body


def gen_audio(response_summary):
    polly = boto3.client("polly", region_name="ap-southeast-1")

    textReference = response_summary["content"][0]["text"]

    response = polly.start_speech_synthesis_task(
        Engine="neural",
        OutputFormat="mp3",
        OutputS3BucketName="polly-practice-bren",
        OutputS3KeyPrefix="voice/",
        Text=textReference,
        VoiceId="Matthew",
    )

    return response, textReference


def extract_text_pymupdf(pdf_bytes: bytes) -> str:
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        return "\n".join([page.get_text() for page in doc])
    except Exception as e:
        raise ValueError("PDF extraction failed") from e
