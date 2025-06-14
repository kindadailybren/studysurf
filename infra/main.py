import uvicorn
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import pymupdf as fitz

app = FastAPI()

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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

    return {"filename": file.filename, "text": full_text, "page_count": len(doc)}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
