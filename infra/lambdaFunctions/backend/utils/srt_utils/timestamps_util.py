# timestamp_estimator.py

def estimate_timings(sentences: list[str], wpm: int = 150) -> list[tuple[float, float]]:
    """
    Estimate start and end timestamps for each sentence based on words per minute.
    
    Args:
        sentences (list[str]): List of sentences to estimate.
        wpm (int): Words per minute reading speed (default 150).
    
    Returns:
        List of tuples: (start_time, end_time) in seconds.
    """
    timings = []
    current_time = 0.0
    words_per_second = wpm / 60.0

    for sentence in sentences:
        word_count = len(sentence.split())
        duration = word_count / words_per_second
        start_time = current_time
        end_time = current_time + duration
        timings.append((start_time, end_time))
        current_time = end_time

    return timings
