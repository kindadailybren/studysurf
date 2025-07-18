from fastapi.responses import JSONResponse


class GenVidUseCase:
    def __init__(self, bedrock_service, polly_service, s3_service):
        self.AI = bedrock_service
        self.VoiceGenerator = polly_service
        self.VideoStorage = s3_service

    async def generate_video_usecase(self, file):
        try:
            generatedSummary = self.AI.gen_summarization(file)
            audioGenerated, textReference = self.VoiceGenerator.gen_audio(
                generatedSummary
            )

            videoUrl = self.VideoStorage.uploadVideo()#pass vid file path from carlos as argument?

            return JSONResponse(
                content={
                    "answer": textReference,
                    "input_tokens": generatedSummary["usage"]["input_tokens"],
                    "output_tokens": generatedSummary["usage"]["output_tokens"],
                    "s3_audio_uri": audioGenerated["SynthesisTask"]["OutputUri"],
                    "task_status": audioGenerated["SynthesisTask"]["TaskStatus"],
                    "video_url": videoUrl#notsure
                }
            )

        except Exception as e:
            return JSONResponse(status_code=500, content={"error": str(e)})
