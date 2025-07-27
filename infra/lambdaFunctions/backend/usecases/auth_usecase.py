from botocore.exceptions import ClientError
from models.user import (
    UserCreate,
    UserLogin,
    UserConfirm,
    UserConfirmPasswordChange,
    UserDelete,
)
from models.base import User
from fastapi.responses import JSONResponse
from utils.jsonreturn_util import jsonResponse
from utils.jwt_util import usernameFromIdToken
from utils.cookie_util import createRefreshTokenCookie, deleteRefreshTokenCookie


class AuthUsecase:
    def __init__(self, cognito_service, dynamodb_service):
        self.auth = cognito_service
        self.db = dynamodb_service

    def listUsers(self):
        try:
            users = self.auth.listUsers()
            return jsonResponse(users)
        except ClientError as err:
            raise err

    def createUser(self, credentials: UserCreate):
        try:
            user = self.auth.createUser(credentials)

            user_data = User(
                user_id=user["UserSub"],
                username=credentials.username,
                email=credentials.email,
            )
            self.db.putUser(user_data)

            return jsonResponse(user)

        except ClientError as err:
            raise err

    def confirmUser(self, credentials: UserConfirm):
        try:
            user = self.auth.confirmUser(credentials)

            user_data = self.auth.getUser(credentials.username)
            user_id = user_data["UserAttributes"][2]["Value"]

            self.db.updateUserConfirmationStatus(user_id)

            return jsonResponse(user)
        except ClientError as err:
            raise err

    def loginUser(self, credentials: UserLogin):
        try:
            loginResponse = self.auth.loginUser(credentials)
            token = loginResponse["AuthenticationResult"]

            idToken = token["IdToken"]
            username = usernameFromIdToken(idToken)
            response = JSONResponse(
                content={
                    "accessToken": token["AccessToken"],
                    "idToken": idToken,
                    "expiration": token["ExpiresIn"],
                    "username": username,
                }
            )

            refreshToken = token["RefreshToken"]
            createRefreshTokenCookie(response, refreshToken)

            return response

        except ClientError as err:
            raise err

    def refreshAccessToken(self, refresh_token):
        try:
            loginResponse = self.auth.refreshAccessToken(refresh_token)
            token = loginResponse["AuthenticationResult"]

            idToken = token["IdToken"]
            username = usernameFromIdToken(idToken)

            response = JSONResponse(
                content={
                    "accessToken": token["AccessToken"],
                    "idToken": idToken,
                    "expiration": token["ExpiresIn"],
                    "username": username,
                }
            )

            return response

        except ClientError as err:
            raise err

    def forgotPassword(self, username):
        try:
            user = self.auth.forgotPassword(username)
            return jsonResponse(user)

        except ClientError as err:
            raise err

    def confirmForgotPassword(self, credentials: UserConfirmPasswordChange):
        try:
            user = self.auth.confirmForgotPassword(credentials)
            return jsonResponse(user)

        except ClientError as err:
            raise err

    def deleteUser(self, credentials: UserDelete):
        try:
            user_data = self.auth.getUser(credentials.username)
            user_id = user_data["UserAttributes"][2]["Value"]

            userDelete = self.auth.deleteUserCognito(credentials.accessCode)
            self.db.deleteUserDynamo(user_id)

            return jsonResponse(userDelete)

        except ClientError as err:
            raise err

    def logoutUser(self, accessToken):
        try:
            response = self.auth.logoutUser(accessToken)
            deleteRefreshTokenCookie(
                response=JSONResponse(content={"message": "Logout successful"})
            )

            return response

        except ClientError as err:
            raise err
