import fitz


def extract_text_pymupdf(pdf_bytes: bytes) -> str:
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        return "\n".join([page.get_text() for page in doc])
    except Exception as e:
        raise ValueError("PDF extraction failed") from e


# Helper function: extract text using fitz (PyMuPDF)
# class GenVidUseCase:
#     def __init__(self, bedrock_runtime, polly):
