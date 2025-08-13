from fastapi import APIRouter, Request, Depends, Query
from usecases.genvid_usecase import GenVidUseCase
from services.AWS.bedrock_service import AWS_Bedrock
from services.AWS.polly_service import AWS_Polly
from services.AWS.s3_service import AWS_S3
from services.AWS.dynamodb_service import AWS_DynamoDB_Video
from utils.genvid_utils.moviepy_service import MoviePy

genvid_router = APIRouter()


@genvid_router.get("/hello")
async def hello():
    return {"message": "Hello World"}


@genvid_router.post("/genvid")
async def generate_video(
    request: Request,
    bedrock: AWS_Bedrock = Depends(AWS_Bedrock),
    polly: AWS_Polly = Depends(AWS_Polly),
    moviepy: MoviePy = Depends(MoviePy),
    s3: AWS_S3 = Depends(AWS_S3),
    dynamodb: AWS_DynamoDB_Video = Depends(AWS_DynamoDB_Video),
    username=Query(None),
):
    file = await request.body()

    uc = GenVidUseCase(bedrock, polly, moviepy, s3, dynamodb)
    return await uc.generate_video_usecase(file, username)
