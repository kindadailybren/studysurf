import os
import time
os.environ["IMAGEMAGICK_BINARY"] = r"C:\Program Files\ImageMagick-7.1.2-Q16-HDRI\magick.exe"
from fastapi.responses import JSONResponse

class GenVidUseCase:
    def __init__(self, bedrock_service, polly_service, moviepy_service, s3_service):
        self.AI = bedrock_service
        self.VoiceGenerator = polly_service
        self.VideoCreator = moviepy_service
        self.VideoStorage = s3_service

    async def generate_video_usecase(self, file):
        try:
            generatedSummary = self.AI.gen_summarization(file)

            localPathSubwayVideo = self.VideoStorage.grabVideoSubwayFroms3()
            time.sleep(5)
            localPathAudio = self.VideoStorage.grabAudioFroms3(
                audioGenerated["SynthesisTask"]["OutputUri"]
            )  # tmp

            try:
                os.remove(localPathAudio)
                os.remove(localPathSubwayVideo)
                print("File deleted successfully.")
            except Exception as e:
                print(f"Error deleting file: {e}")
            # videoUrl = self.VideoStorage.uploadVideo() #pass vid file path from carlos as argument?
            
            audioGenerated, textReference = self.VoiceGenerator.gen_audio(generatedSummary)

            filename = "base.mp4"  # Replace this with dynamic filename if needed

            base_path = ""
            video_input = {
                "filename": filename,
                "summary_text": textReference,
                "font_size": 32,
                "font_color": "white",
                "bg_color": "black",
                "position": "center"
            }

            self.VideoCreator.generate_video_with_text(video_input)

            # 6. Return useful info
            return JSONResponse(
                content={
                    "answer": textReference,
                    "input_tokens": generatedSummary["usage"]["input_tokens"],
                    "output_tokens": generatedSummary["usage"]["output_tokens"],
                    "s3_audio_uri": audioGenerated["SynthesisTask"]["OutputUri"],
                    "task_status": audioGenerated["SynthesisTask"]["TaskStatus"],
                    "video_path": base_path + "output_" + filename,
                     # "video_url": videoUrl,#notsure
                    "local_path_tmp_audio": localPathAudio,
                    "local_path_tmp_video": localPathSubwayVideo,
                }
            )

        except Exception as e:
            return JSONResponse(status_code=500, content={"error": str(e)})
