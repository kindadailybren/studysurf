from fastapi.responses import JSONResponse


class GenVidUseCase:
    def __init__(self, bedrock_service, polly_service, moviepy_service):
        self.AI = bedrock_service
        self.VoiceGenerator = polly_service
        self.VideoCreator = moviepy_service

    async def generate_video_usecase(self, file):
        try:
            generatedSummary = self.AI.gen_summarization(file)
            audioGenerated, textReference = self.VoiceGenerator.gen_audio(
                generatedSummary
            )

            video_input = {
                "video_path": "ambot wala pako kabalo dawg asa ni kuhaon",
                "summary_text": textReference,
                "output_path": "hahahahah",
                "font_size": 32,
                "font_color": "white",
                "bg_color": "black",
                "position": "center"
            }

            #self.VideoCreator.generate_video_with_text(video_input)

            return JSONResponse(
                content={
                    "answer": textReference,
                    "input_tokens": generatedSummary["usage"]["input_tokens"],
                    "output_tokens": generatedSummary["usage"]["output_tokens"],
                    "s3_audio_uri": audioGenerated["SynthesisTask"]["OutputUri"],
                    "task_status": audioGenerated["SynthesisTask"]["TaskStatus"],
                }
            )

        except Exception as e:
            return JSONResponse(status_code=500, content={"error": str(e)})
