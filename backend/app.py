from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from pdfminer.high_level import extract_text
from io import BytesIO
import traceback
import uvicorn
import json
import boto3

app = FastAPI()
handler = Mangum(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

bedrock_runtime = boto3.client("bedrock-runtime", region_name="ap-southeast-1")


@app.get("/hello")
async def hello():
    return {"message": "Hello World"}


@app.post("/genvid")
async def generate_video(request: Request):
    try:
        # Parse the raw Lambda proxy event
        body = await request.body()

        decoded_file = body

        # Extract text from PDF
        text = extract_text(BytesIO(decoded_file))

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
                            + "\nSummarize this whole topic in one straight paragraph for a college student trying to understand it. Dont Say 'Here is a one-paragraph summary' or any other intro",
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

        return JSONResponse(
            content={
                "answer": response_body["content"][0]["text"],
                "input_tokens": response_body["usage"]["input_tokens"],
                "output_tokens": response_body["usage"]["output_tokens"],
            }
        )

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
