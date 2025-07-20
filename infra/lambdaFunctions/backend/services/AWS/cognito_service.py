import boto3
from models.user import UserCreate, UserLogin, UserConfirm, UserConfirmPasswordChange


class AWS_Cognito:
    def __init__(self):
        self.cognitoClient = boto3.client("cognito-idp", region_name="ap-southeast-1")
        self.userPoolId = "ap-southeast-1_BJK9jXo9C"
        self.cognitoAppClientId = "25ch5mniuhjv9t64oqtlbhmnmq"

    def listUsers(self):
        users = self.cognitoClient.list_users(
            UserPoolId=self.userPoolId,
            Limit=60,
        )
        return users

    def getUser(self, username):
        users = self.cognitoClient.admin_get_user(
            UserPoolId=self.userPoolId,
            Username=username,
        )
        return users

    def createUser(self, credentials: UserCreate):
        createdUser = self.cognitoClient.sign_up(
            ClientId=self.cognitoAppClientId,
            Username=credentials.username,
            Password=credentials.password,
            UserAttributes=[
                {"Name": "email", "Value": credentials.email},
            ],
        )

        return createdUser

    def confirmUser(self, credentials: UserConfirm):
        confirmedUser = self.cognitoClient.confirm_sign_up(
            ClientId=self.cognitoAppClientId,
            Username=credentials.username,
            ConfirmationCode=credentials.confirmationCode,
        )

        return confirmedUser

    def loginUser(self, credentials: UserLogin):
        loginResponse = self.cognitoClient.initiate_auth(
            AuthFlow="USER_PASSWORD_AUTH",
            AuthParameters={
                "USERNAME": credentials.username,
                "PASSWORD": credentials.password,
            },
            ClientId=self.cognitoAppClientId,
        )

        return loginResponse

    def refreshAccessToken(self, refresh_token):
        loginResponse = self.cognitoClient.initiate_auth(
            AuthFlow="REFRESH_TOKEN_AUTH",
            AuthParameters={
                "REFRESH_TOKEN": refresh_token,
            },
            ClientId=self.cognitoAppClientId,
        )

        return loginResponse

    def deleteUserCognito(self, accessToken):
        userDelete = self.cognitoClient.delete_user(AccessToken=accessToken)

        return userDelete

    def forgotPassword(self, username):
        userDelete = self.cognitoClient.forgot_password(
            ClientId=self.cognitoAppClientId,
            Username=username,
        )

        return userDelete

    def confirmForgotPassword(self, credentials: UserConfirmPasswordChange):
        userConfirm = self.cognitoClient.confirm_forgot_password(
            ClientId=self.cognitoAppClientId,
            Username=credentials.username,
            ConfirmationCode=credentials.confirmationCode,
            Password=credentials.password,
        )

        return userConfirm
