from fastapi import APIRouter, Request, Depends
from usecases.genvid_usecase import GenVidUseCase
from services.AWS.bedrock_service import AWS_Bedrock
from services.AWS.polly_service import AWS_Polly


genvid_router = APIRouter()


@genvid_router.get("/hello")
async def hello():
    return {"message": "Hello World"}


@genvid_router.post("/genvid")
async def generate_video(
    request: Request,
    bedrock: AWS_Bedrock = Depends(AWS_Bedrock),
    polly: AWS_Polly = Depends(AWS_Polly),
):
    file = await request.body()

    uc = GenVidUseCase(bedrock, polly)
    return await uc.generate_video_usecase(file)
