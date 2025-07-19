import boto3
import os

class AWS_S3:
    def __init__(self):
        self.s3_client = boto3.client("s3", region_name="ap-southeast-1")
        self.bucket = "studysurf-outputvids"
    def uploadVideo(self, file_path):
        key = os.path.basename(file_path)

        try:
                
            self.s3_client.upload_file(
                Filename=file_path,
                Bucket=self.bucket,
                Key=key,
                ExtraArgs={"ContentType": "video/mp4"}
            )

            return f"https://{self.bucket}.s3.{self.s3_client.meta.region_name}.amazonaws.com/{key}"
        
        except Exception as e:
            return None
