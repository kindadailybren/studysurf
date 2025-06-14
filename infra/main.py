import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random

app = FastAPI()

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/gallery")
async def root():
    return {"message": "Welcome to the Gallery API!"}


@app.get("/genvid")
async def generate_video():
    return {"video": "Brainrot Video", "id": random.randint(1, 100)}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
