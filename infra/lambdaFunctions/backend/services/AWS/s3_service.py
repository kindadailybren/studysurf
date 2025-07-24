from fastapi.responses import JSONResponse
import boto3
import os
import random
import urllib.parse
from utils.getFilePath_util import get_temp_file_path


class AWS_S3:
    def __init__(self):
        self.s3_client = boto3.client("s3", region_name="ap-southeast-1")
        self.bucket = "studysurf-outputvids"
        self.bucketAudio = "polly-practice-bren"
        self.bucketSubwayVid = "subway-background-vids"

    def grabAudioFroms3(self, audio_s3_link):
        parsedUrl = urllib.parse.urlparse(audio_s3_link)
        pathParts = parsedUrl.path.lstrip("/").split("/", 1)

        if len(pathParts) < 2:
            print("[ERROR] Cannot determine key from S3 URL.")
            return None

        key = pathParts[1]
        local_path = get_temp_file_path(os.path.basename(key))

        print(f"[DEBUG] audio_s3_link: {audio_s3_link}")
        print(f"[DEBUG]  bucket: {self.bucketAudio}")
        print(f"[DEBUG] parsed key: {key}")
        print(f"[DEBUG] local path: {local_path}")

        try:
            self.s3_client.download_file(self.bucketAudio, key, local_path)
            print("[DEBUG] Download successful")
            return local_path
        except Exception as e:
            print(f"Error downloading audio from S3: {e}")
            return None

    def grabVideoSubwayFroms3(self):
        try:
            response = self.s3_client.list_objects_v2(Bucket=self.bucketSubwayVid)

            if "Contents" not in response or not response["Contents"]:
                print("No videos found in the S3 bucket.")
                return None

            objects = response["Contents"]
            random_object = random.choice(objects)
            key = random_object["Key"]

            local_path = get_temp_file_path(os.path.basename(key))

            self.s3_client.download_file(self.bucketSubwayVid, key, local_path)

            return local_path

        except Exception as e:
            print(f"Error downloading video from S3: {e}")
            return None

    def uploadVideo(self, file_path):
        key = os.path.basename(file_path)

        try:
            self.s3_client.upload_file(
                Filename=file_path,
                Bucket=self.bucket,
                Key=key,
                ExtraArgs={"ContentType": "video/mp4"},
            )

            return f"https://{self.bucket}.s3.{self.s3_client.meta.region_name}.amazonaws.com/{key}"

        except Exception as e:
            return JSONResponse(status_code=500, content={"error": str(e)})
