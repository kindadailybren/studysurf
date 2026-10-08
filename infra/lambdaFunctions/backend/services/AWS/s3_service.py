import os
import random
import urllib.parse
import boto3
from fastapi.responses import JSONResponse
from utils.getFilePath_util import get_temp_file_path


class AWS_S3:
    def __init__(self):
        region = os.environ.get("AWS_REGION", "ap-southeast-1")
        self.s3_client = boto3.client("s3", region_name=region)
        self.mediaBucket = os.environ.get(
            "MEDIA_BUCKET_NAME",
            os.environ.get("S3_BUCKET_NAME", "studysurf-outputvids"),
        )

    def generatePresignedUploadUrl(
        self, key: str, content_type: str = "application/pdf", expiration: int = 900
    ):
        """Generate a presigned PUT URL for client-side direct upload."""
        try:
            url = self.s3_client.generate_presigned_url(
                ClientMethod="put_object",
                Params={
                    "Bucket": self.mediaBucket,
                    "Key": key,
                    "ContentType": content_type,
                },
                ExpiresIn=expiration,
            )
            return url
        except Exception as e:
            print(f"[ERROR] Failed to generate presigned upload URL: {e}")
            raise e

    def generatePresignedDownloadUrl(self, key: str, expiration: int = 3600):
        try:
            return self.s3_client.generate_presigned_url(
                ClientMethod="get_object",
                Params={
                    "Bucket": self.mediaBucket,
                    "Key": key,
                },
                ExpiresIn=expiration,
            )
        except Exception as e:
            print(f"[ERROR] Failed to generate presigned download URL: {e}")
            return None

    def grabAudioFroms3(self, audio_s3_link_or_key: str):
        if audio_s3_link_or_key.startswith("http"):
            parsedUrl = urllib.parse.urlparse(audio_s3_link_or_key)
            pathParts = parsedUrl.path.lstrip("/").split("/", 1)
            key = pathParts[1] if len(pathParts) > 1 else pathParts[0]
            bucket = pathParts[0] if len(pathParts) > 1 else self.mediaBucket
        else:
            key = audio_s3_link_or_key
            bucket = self.mediaBucket

        local_path = get_temp_file_path(os.path.basename(key))
        try:
            self.s3_client.download_file(bucket, key, local_path)
            return local_path
        except Exception as e:
            print(f"[ERROR] Error downloading audio from S3 ({bucket}/{key}): {e}")
            return None

    def grabBackgroundVideoFromS3(self, style: str = "subway"):
        prefix = f"backgrounds/{style}/"
        try:
            response = self.s3_client.list_objects_v2(
                Bucket=self.mediaBucket, Prefix=prefix
            )

            # Fallback to generic backgrounds if style subfolder empty
            if "Contents" not in response or not response["Contents"]:
                response = self.s3_client.list_objects_v2(
                    Bucket=self.mediaBucket, Prefix="backgrounds/"
                )

            if "Contents" not in response or not response["Contents"]:
                print("[WARN] No background videos found in S3 media bucket.")
                # Check for local fallback in media/
                local_fallback = os.path.join(
                    os.path.dirname(__file__), "..", "..", "media", "subway-1min-1.mp4"
                )
                if os.path.exists(local_fallback):
                    return local_fallback
                return None

            objects = [
                obj for obj in response["Contents"] if obj["Key"].endswith(".mp4")
            ]
            if not objects:
                return None

            random_object = random.choice(objects)
            key = random_object["Key"]
            local_path = get_temp_file_path(os.path.basename(key))
            self.s3_client.download_file(self.mediaBucket, key, local_path)
            return local_path

        except Exception as e:
            print(f"[ERROR] Error downloading background video from S3: {e}")
            return None

    def grabVideoSubwayFroms3(self):
        return self.grabBackgroundVideoFromS3("subway")

    def uploadVideo(self, file_path: str, custom_key: str = None):
        key = custom_key or f"output-videos/{os.path.basename(file_path)}"
        try:
            self.s3_client.upload_file(
                Filename=file_path,
                Bucket=self.mediaBucket,
                Key=key,
                ExtraArgs={"ContentType": "video/mp4"},
            )
            region = self.s3_client.meta.region_name
            return f"https://{self.mediaBucket}.s3.{region}.amazonaws.com/{key}"
        except Exception as e:
            print(f"[ERROR] Failed to upload video: {e}")
            return None
