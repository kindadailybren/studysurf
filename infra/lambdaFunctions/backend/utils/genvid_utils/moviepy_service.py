from moviepy.editor import VideoFileClip, TextClip, CompositeVideoClip
import os

class MoviePy:
    def __init__(self):
        pass

    def generate_video_with_text(self, audioGenerated):
        #TO BE EDITED: for s3 integration
        base_path = ""
        video_path = os.path.abspath(base_path + audioGenerated.get("filename", "video.mp4"))
        output_path = os.path.abspath(base_path + "output_" + audioGenerated.get("filename", "video.mp4"))

        summary_text = audioGenerated["summary_text"]

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
