import fitz


class PDFParser:
    def extract_text_util(self, pdf_bytes=bytes) -> str:
        try:
            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
            return "\n".join([page.get_text() for page in doc])
        except Exception as e:
            raise ValueError("PDF extraction failed") from e
