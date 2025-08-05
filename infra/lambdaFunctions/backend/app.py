import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from controllers.app_router import app_router

app = FastAPI()
handler = Mangum(app, lifespan="off")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://dev-s3-bucket-application-studysurf.s3-website-ap-southeast-1.amazonaws.com",
        "http://staging-s3-bucket-application-studysurf.s3-website-ap-southeast-1.amazonaws.com",
        "https://d3guxtdjraajgf.cloudfront.net",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(app_router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
