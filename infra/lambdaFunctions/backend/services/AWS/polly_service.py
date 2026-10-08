import os
import json
import boto3


class AWS_Polly:
    def __init__(self):
        region = os.environ.get("AWS_REGION", "ap-southeast-1")
        self.polly_client = boto3.client("polly", region_name=region)
        self.mediaBucket = os.environ.get(
            "MEDIA_BUCKET_NAME",
            os.environ.get("S3_BUCKET_NAME", "studysurf-outputvids"),
        )

    def gen_audio(self, text_or_summary, voice_id: str = "Matthew", job_id: str = None):
        if isinstance(text_or_summary, dict) and "content" in text_or_summary:
            textReference = text_or_summary["content"][0]["text"]
        else:
            textReference = str(text_or_summary)

        prefix = f"audio/{job_id}/" if job_id else "audio/"

        response = self.polly_client.start_speech_synthesis_task(
            Engine="neural",
            OutputFormat="mp3",
            OutputS3BucketName=self.mediaBucket,
            OutputS3KeyPrefix=prefix,
            Text=textReference,
            VoiceId=voice_id,
        )

        return response, textReference

    def gen_speech_marks(self, text_or_summary, voice_id: str = "Matthew"):
        if isinstance(text_or_summary, dict) and "content" in text_or_summary:
            textReference = text_or_summary["content"][0]["text"]
        else:
            textReference = str(text_or_summary)

        marks_response = self.polly_client.synthesize_speech(
            Engine="neural",
            OutputFormat="json",
            Text=textReference,
            VoiceId=voice_id,
            SpeechMarkTypes=["word"],
        )

        speech_marks = (
            marks_response["AudioStream"].read().decode("utf-8").splitlines()
        )
        parsed_marks = [json.loads(line) for line in speech_marks if line.strip()]

        return parsed_marks
