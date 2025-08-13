from fastapi import APIRouter, Request, Depends, Query
from services.AWS.dynamodb_service import AWS_DynamoDB_Video
from usecases.db_usecase import DbUseCase

db_router = APIRouter()


@db_router.post("/videos")
def generate_video(
    request: Request,
    dynamodb: AWS_DynamoDB_Video = Depends(AWS_DynamoDB_Video),
    username=Query(None),
):
    uc = DbUseCase(dynamodb)
    return uc.retrieveVideoFromDb(username)
