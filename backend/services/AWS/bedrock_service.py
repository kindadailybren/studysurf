import fitz
import json
import boto3


def extract_text_pymupdf(pdf_bytes: bytes) -> str:
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        return "\n".join([page.get_text() for page in doc])
    except Exception as e:
        raise ValueError("PDF extraction failed") from e


class AWS_Bedrock:
    def __init__(self):
        self.bedrock_runtime = boto3.client(
            "bedrock-runtime", region_name="ap-southeast-1"
        )

    def gen_summarization(self, file):
        text = extract_text_pymupdf(file)

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
