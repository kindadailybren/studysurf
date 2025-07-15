from fastapi import APIRouter, Request, Depends
from usecases.auth_usecase import AuthUsecase
from services.AWS.cognito_service import AWS_Cognito
from models.user import UserCreate


auth_router = APIRouter()


@auth_router.get("/get-users")
async def get_user(request: Request, cognito: AWS_Cognito = Depends(AWS_Cognito)):
    uc = AuthUsecase(cognito)
    return await uc.listusers()


@auth_router.post("/create-user")
async def create_user(
    credentials: UserCreate, cognito: AWS_Cognito = Depends(AWS_Cognito)
):
    uc = AuthUsecase(cognito)
    return await uc.createuser(credentials)
