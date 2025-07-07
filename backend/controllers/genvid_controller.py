from fastapi import APIRouter, Request
from usecases.genvid_usecase import GenVidUseCase


genvid_router = APIRouter()


@genvid_router.get("/hello")
async def hello():
    return {"message": "Hello World"}


@genvid_router.post("/genvid")
async def generate_video(request: Request):
    uc = GenVidUseCase()
    return await uc.generate_video(request)
