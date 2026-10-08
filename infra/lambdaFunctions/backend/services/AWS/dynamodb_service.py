import os
import boto3
from models.base import User, Video, Job, JobStatus


class AWS_DynamoDB_User:
    def __init__(self):
        region = os.environ.get("AWS_REGION", "ap-southeast-1")
        self.dynamodb = boto3.client("dynamodb", region_name=region)
        self.table = os.environ.get("TABLE_NAME", "Data-dev")

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


class AWS_DynamoDB_Job:
    def __init__(self):
        region = os.environ.get("AWS_REGION", "ap-southeast-1")
        self.dynamodb = boto3.client("dynamodb", region_name=region)
        self.table = os.environ.get("TABLE_NAME", "Data-dev")

    def createJob(self, job: Job):
        item = {
            "PK": {"S": f"USER#{job.username}"},
            "SK": {"S": f"JOB#{job.job_id}"},
            "PK1": {"S": f"JOB#{job.job_id}"},
            "SK1": {"S": f"JOB#{job.job_id}"},
            "jobId": {"S": job.job_id},
            "username": {"S": job.username},
            "filename": {"S": job.filename or "document.pdf"},
            "status": {"S": job.status.value},
            "style": {"S": job.style or "subway"},
            "voice": {"S": job.voice or "Matthew"},
            "createdAt": {"S": job.created_at.isoformat()},
            "updatedAt": {"S": job.updated_at.isoformat()},
        }
        if job.pdf_s3_key:
            item["pdfS3Key"] = {"S": job.pdf_s3_key}
        if job.audio_s3_key:
            item["audioS3Key"] = {"S": job.audio_s3_key}
        if job.video_url:
            item["videoUrl"] = {"S": job.video_url}
        if job.summary_text:
            item["summaryText"] = {"S": job.summary_text}

        return self.dynamodb.put_item(TableName=self.table, Item=item)

    def updateJobStatus(self, job_id: str, username: str, status: str, **kwargs):
        update_expr = ["#st = :status", "updatedAt = :now"]
        expr_names = {"#st": "status"}
        from datetime import datetime

        expr_vals = {
            ":status": {"S": status},
            ":now": {"S": datetime.now().isoformat()},
        }

        if "video_url" in kwargs and kwargs["video_url"]:
            update_expr.append("videoUrl = :vurl")
            expr_vals[":vurl"] = {"S": kwargs["video_url"]}
        if "summary_text" in kwargs and kwargs["summary_text"]:
            update_expr.append("summaryText = :sum")
            expr_vals[":sum"] = {"S": kwargs["summary_text"]}
        if "error_message" in kwargs and kwargs["error_message"]:
            update_expr.append("errorMessage = :err")
            expr_vals[":err"] = {"S": kwargs["error_message"]}
        if "audio_s3_key" in kwargs and kwargs["audio_s3_key"]:
            update_expr.append("audioS3Key = :akey")
            expr_vals[":akey"] = {"S": kwargs["audio_s3_key"]}

        return self.dynamodb.update_item(
            TableName=self.table,
            Key={
                "PK": {"S": f"USER#{username}"},
                "SK": {"S": f"JOB#{job_id}"},
            },
            UpdateExpression="SET " + ", ".join(update_expr),
            ExpressionAttributeNames=expr_names,
            ExpressionAttributeValues=expr_vals,
        )

    def getJob(self, job_id: str, username: str):
        response = self.dynamodb.get_item(
            TableName=self.table,
            Key={
                "PK": {"S": f"USER#{username}"},
                "SK": {"S": f"JOB#{job_id}"},
            },
        )
        item = response.get("Item")
        if not item:
            return None
        return self._unmarshal_job(item)

    def getJobByIdGSI(self, job_id: str):
        # Query GSI1 to find job by job_id across users
        response = self.dynamodb.query(
            TableName=self.table,
            IndexName="GSI1",
            KeyConditionExpression="PK1 = :pk1",
            ExpressionAttributeValues={":pk1": {"S": f"JOB#{job_id}"}},
        )
        items = response.get("Items", [])
        if not items:
            return None
        return self._unmarshal_job(items[0])

    def listJobs(self, username: str):
        response = self.dynamodb.query(
            TableName=self.table,
            KeyConditionExpression="PK = :pk AND begins_with(SK, :sk_prefix)",
            ExpressionAttributeValues={
                ":pk": {"S": f"USER#{username}"},
                ":sk_prefix": {"S": "JOB#"},
            },
            ScanIndexForward=False,
        )
        return [self._unmarshal_job(item) for item in response.get("Items", [])]

    def deleteJob(self, job_id: str, username: str):
        return self.dynamodb.delete_item(
            TableName=self.table,
            Key={
                "PK": {"S": f"USER#{username}"},
                "SK": {"S": f"JOB#{job_id}"},
            },
        )

    def _unmarshal_job(self, item):
        return {
            "job_id": item.get("jobId", {}).get("S", ""),
            "username": item.get("username", {}).get("S", ""),
            "filename": item.get("filename", {}).get("S", "document.pdf"),
            "status": item.get("status", {}).get("S", "PENDING"),
            "style": item.get("style", {}).get("S", "subway"),
            "voice": item.get("voice", {}).get("S", "Matthew"),
            "pdf_s3_key": item.get("pdfS3Key", {}).get("S"),
            "audio_s3_key": item.get("audioS3Key", {}).get("S"),
            "video_url": item.get("videoUrl", {}).get("S"),
            "summary_text": item.get("summaryText", {}).get("S"),
            "error_message": item.get("errorMessage", {}).get("S"),
            "created_at": item.get("createdAt", {}).get("S"),
            "updated_at": item.get("updatedAt", {}).get("S"),
        }


class AWS_DynamoDB_Video:
    def __init__(self):
        region = os.environ.get("AWS_REGION", "ap-southeast-1")
        self.dynamodb = boto3.client("dynamodb", region_name=region)
        self.table = os.environ.get("TABLE_NAME", "Data-dev")

    def uploadVideoToDb(self, video: Video):
        from datetime import datetime

        item = {
            "PK": {"S": f"USER#{video.username}"},
            "SK": {"S": "VIDEO#" + video.video_id},
            "videoId": {"S": video.video_id},
            "videoUrl": {"S": video.video_url},
            "title": {"S": video.title or "Study Summary"},
            "style": {"S": video.style or "subway"},
            "createdDate": {"S": video.created_at or datetime.now().isoformat()},
        }
        return self.dynamodb.put_item(TableName=self.table, Item=item)

    def retrieveVideoFromDb(self, username: str):
        response = self.dynamodb.query(
            TableName=self.table,
            KeyConditionExpression="PK = :pk AND begins_with(SK, :sk_prefix)",
            ExpressionAttributeValues={
                ":pk": {"S": f"USER#{username}"},
                ":sk_prefix": {"S": "VIDEO#"},
            },
        )
        videos = []
        for item in response.get("Items", []):
            videos.append(
                {
                    "video_id": item.get("videoId", {}).get(
                        "S", item.get("SK", {}).get("S", "").replace("VIDEO#", "")
                    ),
                    "video_url": item.get("videoUrl", {}).get("S", ""),
                    "title": item.get("title", {}).get("S", "Study Summary"),
                    "style": item.get("style", {}).get("S", "subway"),
                    "created_at": item.get("createdDate", {}).get("S", ""),
                }
            )
        return videos
