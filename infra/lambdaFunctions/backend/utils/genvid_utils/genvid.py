from moviepy import VideoFileClip, TextClip, CompositeVideoClip

class MoviePy:
    def __init__(self):
        pass

    def generate_video_with_text(self, audioGenerated):
        video_path = audioGenerated["TEMPORARY"]
        summary_text = audioGenerated["summary_text"]
        output_path = audioGenerated["TEMPORARY"]

        # Optional parameters for text styling
        font_size = audioGenerated.get("font_size", 32)
        font_color = audioGenerated.get("font_color", "white")
        bg_color = audioGenerated.get("bg_color", "black")
        position = audioGenerated.get("position", "center")

        video = VideoFileClip(video_path)
        wrapped_text = "\n".join(summary_text.strip().splitlines())
        text_clip = TextClip(
            wrapped_text,
            fontsize=font_size,
            color=font_color,
            bg_color=bg_color,
            size=video.size,
            method='caption'
        ).set_duration(video.duration).set_position(position)

        final = CompositeVideoClip([video, text_clip])
        final.write_videofile(output_path, codec="libx264", audio_codec="aac")
