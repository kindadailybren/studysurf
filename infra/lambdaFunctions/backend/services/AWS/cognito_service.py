import boto3
from models.user import UserCreate


class AWS_Cognito:
    def __init__(self):
        self.cognito_client = boto3.client("cognito-idp", region_name="ap-southeast-1")

    def get_users(self):
        users = self.cognito_client.list_users(
            UserPoolId="ap-southeast-1_BJK9jXo9C",
            Limit=60,
        )
        return users

    def create_user(self, credentials: UserCreate):
        created_user = self.cognito_client.admin_create_user(
            UserPoolId="ap-southeast-1_BJK9jXo9C",
            Username=credentials.username,
            UserAttributes=[
                {"Name": "email", "Value": credentials.email},
            ],
            TemporaryPassword=credentials.password,
        )

        return created_user
