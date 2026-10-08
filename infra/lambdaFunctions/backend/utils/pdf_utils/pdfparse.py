import fitz


class PDFParser:
    def extract_text_util(self, pdf_input) -> str:
        try:
            if isinstance(pdf_input, str):
                doc = fitz.open(pdf_input)
            elif isinstance(pdf_input, (bytes, bytearray)):
                doc = fitz.open(stream=pdf_input, filetype="pdf")
            else:
                doc = fitz.open(stream=bytes(pdf_input), filetype="pdf")
            return "\n".join([page.get_text() for page in doc])
        except Exception as e:
            raise ValueError(f"PDF extraction failed: {e}") from e
