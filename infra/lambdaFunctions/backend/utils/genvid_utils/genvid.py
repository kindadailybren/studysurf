from moviepy.editor import VideoFileClip, TextClip, CompositeVideoClip

def generate_video_with_text(
    video_path: str,
    summary_text: str,
    output_path: str,
    font_size: int = 32,
    font_color: str = "white",
    bg_color: str = "black",
    position: str = "center",
):
    video = VideoFileClip(video_path)
    wrapped_text = "\n".join(summary_text.strip().splitlines())
    text_clip = TextClip(
        wrapped_text,
        fontsize=font_size,
        color=font_color,
        bg_color=bg_color,
        size=video.size,
        method='caption'  # better text layout
    ).set_duration(video.duration).set_position(position)
    final = CompositeVideoClip([video, text_clip])
    final.write_videofile(output_path, codec="libx264", audio_codec="aac")

# video = VideoFileClip(video_path)