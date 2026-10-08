import os
import json
import boto3
from utils.pdf_utils.pdfparse import PDFParser


class AWS_Bedrock:
    def __init__(self):
        region = os.environ.get("AWS_REGION", "ap-southeast-1")
        self.bedrock_runtime = boto3.client(
            "bedrock-runtime", region_name=region
        )
        self.pdf_parser = PDFParser()

    def gen_summarization(self, file_or_text):
        if isinstance(file_or_text, str):
            text = file_or_text
        else:
            text = self.pdf_parser.extract_text_util(file_or_text)

        if not text.strip():
            raise ValueError("No text found in the document")

        prompt = (
            text.strip()
            + "\nSummarize this whole topic in one straight paragraph for a college student trying to understand it. "
            "Make it engaging, memorable, and conversational. Do not say anything like 'Here is a summary' or 'In summary'."
        )

        payload = {
            "modelId": "anthropic.claude-3-haiku-20240307-v1:0",
            "contentType": "application/json",
            "accept": "*/*",
            "body": json.dumps(
                {
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": 1000,
                    "temperature": 0.7,
                    "anthropic_version": "bedrock-2023-05-31",
                }
            ),
        }

        response = self.bedrock_runtime.invoke_model(**payload)
        response_body = json.loads(response.get("body").read())

        return response_body

    def gen_topic_narration(self, topic: str):
        if not topic or not topic.strip():
            raise ValueError("No topic provided for narration")

        prompt = (
            f"Explain the following topic or concept for a short, fast-paced educational video short (approx. 60 to 80 words):\n\n"
            f"Topic: {topic.strip()}\n\n"
            "Guidelines:\n"
            "- Write in one clear, punchy, conversational paragraph.\n"
            "- Hook the listener immediately with an intuitive real-world analogy or surprising fact.\n"
            "- Keep it engaging, educational, and easy to follow for students.\n"
            "- DO NOT include any intro or outro phrases like 'Here is an explanation', 'Welcome to this short', or 'In conclusion'. Jump straight into the explanation."
        )

        payload = {
            "modelId": "anthropic.claude-3-haiku-20240307-v1:0",
            "contentType": "application/json",
            "accept": "*/*",
            "body": json.dumps(
                {
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": 1000,
                    "temperature": 0.7,
                    "anthropic_version": "bedrock-2023-05-31",
                }
            ),
        }

        response = self.bedrock_runtime.invoke_model(**payload)
        response_body = json.loads(response.get("body").read())

        return response_body

