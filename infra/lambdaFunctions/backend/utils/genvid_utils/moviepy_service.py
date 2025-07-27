from moviepy import VideoFileClip, TextClip, CompositeVideoClip, AudioFileClip
from utils.getFilePath_util import get_temp_file_path
import os


class MoviePy:
    def __init__(self):
        pass

    def generate_video_with_text(self, audioGenerated):
        # TO BE EDITED: for s3 integration
        bgVid = audioGenerated["bgVidLocalPath"]
        audio = audioGenerated["audioLocalPath"]
        speechMarks = audioGenerated["speechMarks"]
        key = audioGenerated.get("filename", "video.mp4")

        output_path = get_temp_file_path(os.path.basename(key))

        summary_text = audioGenerated["summary_text"]
        font_size = audioGenerated.get("font_size", 32)
        font_color = audioGenerated.get("font_color", "white")
        position = audioGenerated.get("position", "center")

        narration = AudioFileClip(audio)
        video = VideoFileClip(bgVid)
        video = video.with_audio(narration)
        video = video.subclip(0, narration.duration)

        wrapped_text = "\n".join(summary_text.strip().splitlines())
        text_clip = (
            TextClip(
                text=wrapped_text,
                font_size=font_size,
                color=font_color,
                size=video.size,
                method="caption",
            )
            .with_duration(narration.duration)
            .with_position(position)
        )

        final = CompositeVideoClip([video, text_clip])
        final.write_videofile(
            output_path,
            codec="libx264",
            audio_codec="aac",
            temp_audiofile=os.path.join("/tmp", "temp-audio.m4a"),
            remove_temp=True,
        )

        return output_path
