from fastapi.responses import JSONResponse


def handleException(e: Exception):
    return JSONResponse(status_code=500, content={"error": str(e)})


def handleExceptionLogin(e: Exception):
    return JSONResponse(status_code=401, content={"error": str(e)})
