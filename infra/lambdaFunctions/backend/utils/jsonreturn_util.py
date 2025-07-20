from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder


def jsonResponse(payload):
    return JSONResponse(
        content={
            "users": jsonable_encoder(payload),
        }
    )
