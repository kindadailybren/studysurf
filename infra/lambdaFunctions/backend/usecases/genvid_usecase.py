import os
import uuid
import time
from fastapi.responses import JSONResponse
from models.base import Video


# ImageMagick for MoviePy - TO BE FIXED SINCE THIS CANNOT BE HOSTED
os.environ["IMAGEMAGICK_BINARY"] = (
    r"C:\Program Files\ImageMagick-7.1.2-Q16-HDRI\magick.exe"
)


class GenVidUseCase:
    def __init__(
        self,
        bedrock_service,
        polly_service,
        moviepy_service,
        s3_service,
        dynamodb_service,
    ):
        self.AI = bedrock_service
        self.VoiceGenerator = polly_service
        self.VideoCreator = moviepy_service
        self.VideoStorage = s3_service
        self.db = dynamodb_service

    async def generate_video_usecase(self, file, username):
        try:
            generatedSummary = self.AI.gen_summarization(file)
            audioGenerated, textReference = self.VoiceGenerator.gen_audio(
                generatedSummary
            )
            audioSpeechMarks = self.VoiceGenerator.gen_speech_marks(generatedSummary)

            localPathSubwayVideo = self.VideoStorage.grabVideoSubwayFroms3()

            time.sleep(5)
            outputUri = audioGenerated["SynthesisTask"]["OutputUri"]
            localPathAudio = self.VideoStorage.grabAudioFroms3(outputUri)

            filename = f"{uuid.uuid4()}.mp4"

            video_input = {
                "filename": filename,
                "bgVidLocalPath": localPathSubwayVideo,
                "audioLocalPath": localPathAudio,
                "speechMarks": audioSpeechMarks,
                "summary_text": textReference,
                "font_size": 32,
                "font_color": "white",
                "bg_color": "black",
                "position": "center",
            }

            videoPathOutput = self.VideoCreator.generate_video_with_text(video_input)

            videoUrl = self.VideoStorage.uploadVideo(videoPathOutput)

            videoDetails = Video(
                video_id=filename, username=username, video_url=videoUrl
            )
            self.db.uploadVideoToDb(videoDetails)

            try:
                os.remove(localPathAudio)
                os.remove(localPathSubwayVideo)
                os.remove(localPathAudio)
                os.remove(localPathSubwayVideo)
                print("File deleted successfully.")
            except Exception as e:
                print(f"Error deleting file: {e}")

            return JSONResponse(
                content={
                    "answer": textReference,
                    "input_tokens": generatedSummary["usage"]["input_tokens"],
                    "output_tokens": generatedSummary["usage"]["output_tokens"],
                    "s3_audio_uri": audioGenerated["SynthesisTask"]["OutputUri"],
                    "task_status": audioGenerated["SynthesisTask"]["TaskStatus"],
                    "local_path_tmp_audio": localPathAudio,
                    "local_path_tmp_video": localPathSubwayVideo,
                    "local_path_tmp_output": videoPathOutput,
                    "video_url": videoUrl,
                }
            )

        except Exception as e:
            return JSONResponse(status_code=500, content={"error": str(e)})
