from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
import uvicorn
import fitz
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


# Helper function: extract text using fitz (PyMuPDF)
def extract_text_pymupdf(pdf_bytes: bytes) -> str:
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        return "\n".join([page.get_text() for page in doc])
    except Exception as e:
        raise ValueError("PDF extraction failed") from e


@app.get("/hello")
async def hello():
    return {"message": "Hello World"}


@app.post("/genvid")
async def generate_video(request: Request):
    try:
        # Parse the raw Lambda proxy event
        body = await request.body()

        # Extract text from PDF
        text = extract_text_pymupdf(body)

        if not text.strip():
            raise ValueError("No text found in the PDF")

        prompt = (
            text.strip()
            + "\nSummarize this whole topic in one straight paragraph for a college student trying to understand it. Don't say anything like 'Here is a summary.'"
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
