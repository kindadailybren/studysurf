import uvicorn, logging, json, boto3
from botocore.exceptions import ClientError
from mangum import Mangum
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import pymupdf as fitz

app = FastAPI()
handler = Mangum(app)

origins = ["http://localhost:5173"]

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


def print_answer():
    response = bedrock_runtime.invoke_model(**kwargs)
    response_body = json.loads(response.get("body").read())

    print(response_body["content"][0]["text"])


# @app.post("/upload")
# async def upload_file(file: UploadFile = File(...)):
#     content = await file.read()
#     doc = fitz.open(stream=content, filetype="pdf")
#
#     full_text = ""
#     for page in doc.pages():
#         full_text += page.get_text() + "\n"  # Optional newline between pages
#
#     return {"filename": file.filename, "text": full_text, "page_count": len(doc)}


@app.get("/gallery")
async def root():
    return {"message": "Welcome to the Gallery API!"}


@app.post("/genvid")
async def generate_video(file: UploadFile = File(...)):
    content = await file.read()
    doc = fitz.open(stream=content, filetype="pdf")

    full_text = ""
    for page in doc.pages():
        full_text += page.get_text() + "\n"  # Optional newline between pages

    payload = {
        "modelId": "anthropic.claude-3-haiku-20240307-v1:0",
        "contentType": "application/json",
        "accept": "*/*",
        "body": json.dumps(
            {
                "messages": [
                    {
                        "role": "user",
                        "content": full_text.strip()
                        + "\n Summarize this whole topic in one straight paragraph for a college student trying to understand it.",
                    }
                ],
                "max_tokens": 500,
                "temperature": 0.7,
                "anthropic_version": "bedrock-2023-05-31",
            }
        ),
    }

    response = bedrock_runtime.invoke_model(**payload)
    response_body = json.loads(response.get("body").read())

    return {"answer": response_body["content"][0]["text"]}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
