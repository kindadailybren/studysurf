from fastapi import APIRouter, Depends, Request
from fastapi import HTTPException
from botocore.exceptions import ClientError
from usecases.auth_usecase import AuthUsecase
from services.AWS.cognito_service import AWS_Cognito
from services.AWS.dynamodb_service import AWS_DynamoDB_User
from models.user import (
    UserConfirmPasswordChange,
    UserCreate,
    UserLogin,
    UserConfirm,
    UserDelete,
)


auth_router = APIRouter()


@auth_router.get("/getUsers")
async def getUser(
    cognito: AWS_Cognito = Depends(AWS_Cognito),
    dynamodb: AWS_DynamoDB_User = Depends(AWS_DynamoDB_User),
):
    try:
        uc = AuthUsecase(cognito, dynamodb)
        return uc.listUsers()
    except ClientError as err:
        errorMessage = err.response["Error"]["Message"]
        raise HTTPException(status_code=400, detail=errorMessage)


@auth_router.post("/createUser")
async def createUser(
    credentials: UserCreate,
    cognito: AWS_Cognito = Depends(AWS_Cognito),
    dynamodb: AWS_DynamoDB_User = Depends(AWS_DynamoDB_User),
):
    try:
        uc = AuthUsecase(cognito, dynamodb)
        return uc.createUser(credentials)
    except ClientError as err:
        errorMessage = err.response["Error"]["Message"]
        raise HTTPException(status_code=400, detail=errorMessage)


@auth_router.post("/confirmUser")
async def confirmUser(
    credentials: UserConfirm,
    cognito: AWS_Cognito = Depends(AWS_Cognito),
    dynamodb: AWS_DynamoDB_User = Depends(AWS_DynamoDB_User),
):
    try:
        uc = AuthUsecase(cognito, dynamodb)
        return uc.confirmUser(credentials)
    except ClientError as err:
        errorMessage = err.response["Error"]["Message"]
        raise HTTPException(status_code=400, detail=errorMessage)


@auth_router.post("/login")
async def loginUser(
    credentials: UserLogin,
    cognito: AWS_Cognito = Depends(AWS_Cognito),
    dynamodb: AWS_DynamoDB_User = Depends(AWS_DynamoDB_User),
):
    try:
        uc = AuthUsecase(cognito, dynamodb)
        return uc.loginUser(credentials)
    except ClientError as err:
        errorMessage = err.response["Error"]["Message"]
        raise HTTPException(status_code=400, detail=errorMessage)


@auth_router.post("/logout")
async def logoutUser(
    accessToken: str,
    cognito: AWS_Cognito = Depends(AWS_Cognito),
    dynamodb: AWS_DynamoDB_User = Depends(AWS_DynamoDB_User),
):
    try:
        uc = AuthUsecase(cognito, dynamodb)
        return uc.logoutUser(accessToken)
    except ClientError as err:
        errorMessage = err.response["Error"]["Message"]
        raise HTTPException(status_code=400, detail=errorMessage)


@auth_router.post("/refreshToken")
async def refreshToken(
    request: Request,
    cognito: AWS_Cognito = Depends(AWS_Cognito),
    dynamodb: AWS_DynamoDB_User = Depends(AWS_DynamoDB_User),
):
    refreshToken = request.cookies.get("refresh_token")

    if not refreshToken:
        raise HTTPException(status_code=401, detail="No Refresh Token")

    try:
        uc = AuthUsecase(cognito, dynamodb)
        return uc.refreshAccessToken(refreshToken)
    except ClientError as err:
        errorMessage = err.response["Error"]["Message"]
        raise HTTPException(status_code=400, detail=errorMessage)


@auth_router.post("/deleteUser")
async def deleteUser(
    credentials: UserDelete,
    cognito: AWS_Cognito = Depends(AWS_Cognito),
    dynamodb: AWS_DynamoDB_User = Depends(AWS_DynamoDB_User),
):
    try:
        uc = AuthUsecase(cognito, dynamodb)
        return uc.deleteUser(credentials)
    except ClientError as err:
        errorMessage = err.response["Error"]["Message"]
        raise HTTPException(status_code=400, detail=errorMessage)


@auth_router.post("/forgetPass")
async def forgetPass(
    username,
    cognito: AWS_Cognito = Depends(AWS_Cognito),
    dynamodb: AWS_DynamoDB_User = Depends(AWS_DynamoDB_User),
):
    try:
        uc = AuthUsecase(cognito, dynamodb)
        return uc.forgotPassword(username)
    except ClientError as err:
        errorMessage = err.response["Error"]["Message"]
        raise HTTPException(status_code=400, detail=errorMessage)


@auth_router.post("/forgetPassConfirm")
async def confirmForgetPass(
    credentials: UserConfirmPasswordChange,
    cognito: AWS_Cognito = Depends(AWS_Cognito),
    dynamodb: AWS_DynamoDB_User = Depends(AWS_DynamoDB_User),
):
    try:
        uc = AuthUsecase(cognito, dynamodb)
        return uc.confirmForgotPassword(credentials)
    except ClientError as err:
        errorMessage = err.response["Error"]["Message"]
        raise HTTPException(status_code=400, detail=errorMessage)
