import boto3
import json


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

    def gen_speech_marks(self, response_summary):
        polly = boto3.client("polly", region_name="ap-southeast-1")

        textReference = response_summary["content"][0]["text"]

        marks_response = polly.synthesize_speech(
            Engine="neural",
            OutputFormat="json",
            Text=textReference,
            VoiceId="Matthew",
            SpeechMarkTypes=["word"]
        )

        speech_marks = marks_response["AudioStream"].read().decode("utf-8").splitlines()

        parsed_marks = [json.loads(line) for line in speech_marks if line.strip()]
        #sample :[  '{"time":0,"type":"word","start":0,"end":5,"value":"Hello"}', ]

        return parsed_marks
