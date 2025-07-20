from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str


class UserConfirm(BaseModel):
    username: str
    confirmationCode: str


class UserDelete(BaseModel):
    username: str
    accessCode: str


class UserConfirmPasswordChange(BaseModel):
    username: str
    password: str
    confirmationCode: str


class UserLogin(BaseModel):
    username: str
    password: str
