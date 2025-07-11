import boto3


class AWS_Polly:
    def __init__(self):
        self.polly_client = boto3.client("polly", region_name="ap-southeast-1")

    def gen_audio(self, response_summary):
        polly = boto3.client("polly", region_name="ap-southeast-1")

        textReference = response_summary["content"][0]["text"]

        response = polly.start_speech_synthesis_task(
            Engine="neural",
            OutputFormat="mp3",
            OutputS3BucketName="polly-practice-bren",
            OutputS3KeyPrefix="voice/",
            Text=textReference,
            VoiceId="Matthew",
        )

        return response, textReference
