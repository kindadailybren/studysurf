def createRefreshTokenCookie(response, refreshToken):
    response.set_cookie(
        key="refresh_token",
        value=refreshToken,
        httponly=True,
        secure=True,
        samesite="strict",
        path="/",
    )
