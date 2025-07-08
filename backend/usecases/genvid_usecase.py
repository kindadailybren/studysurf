from fastapi import Request
from fastapi.responses import JSONResponse
from services.AWS.bedrock_service import AWS_Bedrock
from services.AWS.polly_service import AWS_Polly


class GenVidUseCase:
    async def generate_video_usecase(self, request: Request):
        try:
            file = await request.body()

            VoiceGenerator = AWS_Polly()
            AI = AWS_Bedrock()

            generatedSummary = AI.gen_summarization(file)
            audioGenerated, textReference = VoiceGenerator.gen_audio(generatedSummary)

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
