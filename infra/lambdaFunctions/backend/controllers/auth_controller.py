from fastapi import APIRouter, Depends
from usecases.auth_usecase import AuthUsecase
from services.AWS.cognito_service import AWS_Cognito
from services.AWS.dynamodb_service import AWS_DynamoDB_User
from models.user import UserConfirmPasswordChange, UserCreate, UserLogin, UserConfirm


auth_router = APIRouter()


@auth_router.get("/getUsers")
async def getUser(
    cognito: AWS_Cognito = Depends(AWS_Cognito),
    dynamodb: AWS_DynamoDB_User = Depends(AWS_DynamoDB_User),
):
    uc = AuthUsecase(cognito, dynamodb)
    return await uc.listUsers()


@auth_router.post("/createUser")
async def createUser(
    credentials: UserCreate,
    cognito: AWS_Cognito = Depends(AWS_Cognito),
    dynamodb: AWS_DynamoDB_User = Depends(AWS_DynamoDB_User),
):
    uc = AuthUsecase(cognito, dynamodb)
    return await uc.createUser(credentials)


@auth_router.post("/confirmUser")
async def confirmUser(
    credentials: UserConfirm,
    cognito: AWS_Cognito = Depends(AWS_Cognito),
    dynamodb: AWS_DynamoDB_User = Depends(AWS_DynamoDB_User),
):
    uc = AuthUsecase(cognito, dynamodb)
    return await uc.confirmUser(credentials)


@auth_router.post("/login")
async def loginUser(
    credentials: UserLogin,
    cognito: AWS_Cognito = Depends(AWS_Cognito),
    dynamodb: AWS_DynamoDB_User = Depends(AWS_DynamoDB_User),
):
    uc = AuthUsecase(cognito, dynamodb)
    return await uc.loginUser(credentials)


@auth_router.post("/deleteUser")
async def deleteUser(
    accessToken,
    cognito: AWS_Cognito = Depends(AWS_Cognito),
    dynamodb: AWS_DynamoDB_User = Depends(AWS_DynamoDB_User),
):
    uc = AuthUsecase(cognito, dynamodb)
    return await uc.deleteUser(accessToken)


@auth_router.post("/forgetPass")
async def forgetPass(
    username,
    cognito: AWS_Cognito = Depends(AWS_Cognito),
    dynamodb: AWS_DynamoDB_User = Depends(AWS_DynamoDB_User),
):
    uc = AuthUsecase(cognito, dynamodb)
    return await uc.forgotPassword(username)


@auth_router.post("/forgetPassConfirm")
async def confirmForgetPass(
    credentials: UserConfirmPasswordChange,
    cognito: AWS_Cognito = Depends(AWS_Cognito),
    dynamodb: AWS_DynamoDB_User = Depends(AWS_DynamoDB_User),
):
    uc = AuthUsecase(cognito, dynamodb)
    return await uc.confirmForgotPassword(credentials)
