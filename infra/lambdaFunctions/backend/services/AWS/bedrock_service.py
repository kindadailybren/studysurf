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
