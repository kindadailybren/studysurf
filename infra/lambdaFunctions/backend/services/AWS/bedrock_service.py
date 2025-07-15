from utils.pdf_utils.pdfparse import PDFParser
import json
import boto3


class AWS_Bedrock:
    def __init__(self):
        self.bedrock_runtime = boto3.client(
            "bedrock-runtime", region_name="ap-southeast-1"
        )
        self.pdf_parser = PDFParser()

    def gen_summarization(self, file):
        text = self.pdf_parser.extract_text_util(file)

        if not text.strip():
            raise ValueError("No text found in the PDF")

        prompt = (
            text.strip()
            + "\nSummarize this whole topic in one straight paragraph for a college student trying to understand it.\
                Don't say anything like 'Here is a summary.'"
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
