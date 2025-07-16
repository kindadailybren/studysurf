from models.user import UserCreate, UserLogin, UserConfirm, UserConfirmPasswordChange
from models.base import User
from utils.exception_util import handleException, handleExceptionLogin
from utils.jsonreturn_util import jsonResponse


class AuthUsecase:
    def __init__(self, cognito_service, dynamodb_service):
        self.auth = cognito_service
        self.db = dynamodb_service

    async def listUsers(self):
        try:
            users = self.auth.getUsers()
            return jsonResponse(users)
        except Exception as e:
            return handleException(e)

    async def createUser(self, credentials: UserCreate):
        try:
            user = self.auth.createUser(credentials)
            user_data = User(
                user_id=user["UserSub"],
                username=credentials.username,
                email=credentials.email,
            )
            self.db.putUser(user_data)
            return jsonResponse(user)
        except Exception as e:
            return handleException(e)

    async def confirmUser(self, credentials: UserConfirm):
        try:
            user = self.auth.confirmUser(credentials)
            user_data = self.auth.getUser(credentials.username)
            self.db.updateUserConfirmationStatus(
                user_data["UserAttributes"][2]["Value"]
            )
            return jsonResponse(user_data)
        except Exception as e:
            return handleException(e)

    async def loginUser(self, credentials: UserLogin):
        try:
            user = self.auth.loginUser(credentials)
            return jsonResponse(user)

        except Exception as e:
            return handleExceptionLogin(e)

    async def forgotPassword(self, username):
        try:
            user = self.auth.forgotPassword(username)
            return jsonResponse(user)

        except Exception as e:
            return handleExceptionLogin(e)

    async def confirmForgotPassword(self, credentials: UserConfirmPasswordChange):
        try:
            user = self.auth.confirmForgotPassword(credentials)
            return jsonResponse(user)

        except Exception as e:
            return handleExceptionLogin(e)

    async def deleteUser(self, accessToken):
        try:
            userDelete = self.auth.deleteUser(accessToken)
            return jsonResponse(userDelete)

        except Exception as e:
            return handleExceptionLogin(e)
