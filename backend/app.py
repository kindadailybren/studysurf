import uvicorn
import json
import boto3
from mangum import Mangum
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pdfminer.high_level import extract_text
from io import BytesIO

app = FastAPI()
handler = Mangum(app)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


bedrock_runtime = boto3.client(
    service_name="bedrock-runtime",
    region_name="ap-southeast-1",
)


@app.get("/hello")
async def hello():
    return {"message": "Hello World"}


@app.post("/genvid")
async def generate_video(file: UploadFile = File(...)):
    content = await file.read()
    text = extract_text(BytesIO(content))  # Use BytesIO wrapper for in-memory reading

    payload = {
        "modelId": "anthropic.claude-3-haiku-20240307-v1:0",
        "contentType": "application/json",
        "accept": "*/*",
        "body": json.dumps(
            {
                "messages": [
                    {
                        "role": "user",
                        "content": text.strip()
                        + "\nSummarize this whole topic in one straight paragraph for a college student trying to understand it.",
                    }
                ],
                "max_tokens": 1000,
                "temperature": 0.7,
                "anthropic_version": "bedrock-2023-05-31",
            }
        ),
    }

    response = bedrock_runtime.invoke_model(**payload)
    response_body = json.loads(response.get("body").read())

    input_tokens = response_body["usage"]["input_tokens"]
    output_tokens = response_body["usage"]["output_tokens"]

    body = {
        "answer": response_body["content"][0]["text"],
        "input_tokens": input_tokens,
        "output_tokens": output_tokens,
    }

    return JSONResponse(content=body)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
