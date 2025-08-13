import boto3
from models.base import User


class AWS_DynamoDB_User:
    def __init__(self):
        self.dynamodb = boto3.client("dynamodb", region_name="ap-southeast-1")
        self.table = "Data-dev"

    def putUser(self, user: User):
        response = self.dynamodb.put_item(
            TableName=self.table,
            Item={
                "PK": {"S": "USER#" + user.username},
                "SK": {"S": "USER#" + user.username},
                "username": {"S": user.username},
                "email": {"S": user.email},
                "subTier": {"S": user.subscription_tier.value},
                "createdDate": {"S": user.created_at.isoformat()},
                "confirmed": {"BOOL": user.confirmed},
            },
        )
        return response

    def updateUserConfirmationStatus(self, PK):
        response = self.dynamodb.update_item(
            TableName=self.table,
            Key={
                "PK": {"S": "USER#" + PK},
                "SK": {"S": "USER#" + PK},
            },
            UpdateExpression="SET confirmed = :val",
            ExpressionAttributeValues={":val": {"BOOL": True}},
        )

        return response

    def deleteUserDynamo(self, user_id):
        response = self.dynamodb.delete_item(
            TableName=self.table,
            Key={
                "PK": {"S": "USER#" + user_id},
                "SK": {"S": "USER#" + user_id},
            },
        )
        return response


class AWS_DynamoDB_Video:
    def __init__(self):
        self.dynamodb = boto3.client("dynamodb", region_name="ap-southeast-1")
        self.table = "Data-dev"

    def uploadVideoToDb(self, video):
        response = self.dynamodb.put_item(
            TableName=self.table,
            Item={
                "PK": {"S": f"USER#{video.username}"},
                "SK": {"S": "VIDEO#" + video.video_id},
                "videoUrl": {"S": video.video_url},
            },
        )
        return response

    def retrieveVideoFromDb(self, username):
        response = self.dynamodb.query(
            TableName=self.table,
            KeyConditionExpression="PK = :pk",
            ExpressionAttributeValues={":pk": {"S": f"USER#{username}"}},
            ProjectionExpression="videoUrl",
        )

        return response
