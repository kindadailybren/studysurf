from moviepy import VideoFileClip, TextClip, CompositeVideoClip, AudioFileClip
from utils.getFilePath_util import get_temp_file_path
import os


class MoviePy:
    def __init__(self):
        pass

    def generate_video_with_text(self, audioGenerated):
        
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

        caption_clips = []
        for i, mark in enumerate(speechMarks):
            start_time = mark["time"] / 1000  
            word = mark["value"]

            if i + 1 < len(speechMarks):
                end_time = speechMarks[i + 1]["time"] / 1000
                duration = max(0.05, end_time - start_time)  
            else:
                duration = 0.5

            txt_clip = (
                TextClip(
                    text=word,
                    font_size=font_size,
                    color=font_color,
                    size=video.size,
                    method="caption",
                )
                .with_start(start_time)
                .with_duration(duration)
                .with_position(position)
            )

            caption_clips.append(txt_clip)

        final = CompositeVideoClip([video] + caption_clips)

        final.write_videofile(
            output_path,
            codec="libx264",
            audio_codec="aac",
            temp_audiofile=get_temp_file_path("temp-audio.m4a"),
            remove_temp=True,
            threads=4,
            preset="ultrafast",
        )

        return output_path
