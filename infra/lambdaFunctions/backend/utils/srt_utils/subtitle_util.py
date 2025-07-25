from datetime import timedelta

def format_srt_time(seconds: float) -> str:
    """Converts seconds to SRT timestamp format."""
    td = timedelta(seconds=seconds)
    hours, remainder = divmod(td.total_seconds(), 3600)
    minutes, seconds = divmod(remainder, 60)
    milliseconds = int((seconds % 1) * 1000)
    return f"{int(hours):02}:{int(minutes):02}:{int(seconds):02},{milliseconds:03}"

def generate_srt_from_timestamps(
    sentences: list[str],
    timestamps: list[tuple[float, float]],
    output_path: str = "output.srt"
):
    """
    Generate a .srt subtitle file from sentences and timestamps.

    Args:
        sentences: list of subtitle lines.
        timestamps: list of (start, end) times in seconds.
        output_path: where to save the .srt file.
    """
    assert len(sentences) == len(timestamps), "Sentence and timestamp count mismatch."
    
    srt_blocks = []
    
    for i, (sentence, (start, end)) in enumerate(zip(sentences, timestamps), start=1):
        start_str = format_srt_time(start)
        end_str = format_srt_time(end)
        srt_blocks.append(f"{i}\n{start_str} --> {end_str}\n{sentence}\n")

    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(srt_blocks))

    print(f"✅ SRT file saved to {output_path}")
