from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from models.user import UserCreate


class AuthUsecase:
    def __init__(self, cognito_service):
        self.auth = cognito_service

    async def listusers(self):
        try:
            users = self.auth.get_users()
            return JSONResponse(
                content={
                    "users": jsonable_encoder(users),
                }
            )
        except Exception as e:
            return JSONResponse(status_code=500, content={"error": str(e)})

    async def createuser(self, credentials: UserCreate):
        try:
            user = self.auth.create_user(credentials)
            return JSONResponse(
                content={
                    "users": jsonable_encoder(user),
                }
            )
        except Exception as e:
            return JSONResponse(status_code=500, content={"error": str(e)})
