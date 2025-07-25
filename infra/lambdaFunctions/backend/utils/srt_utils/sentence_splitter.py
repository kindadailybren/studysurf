import nltk

try:
    nltk.data.find("tokenizers/punkt")
except LookupError:
    nltk.download("punkt")

def split_sentences(text: str) -> list[str]:
    """Split a block of text into a list of sentences."""
    return nltk.tokenize.sent_tokenize(text)
