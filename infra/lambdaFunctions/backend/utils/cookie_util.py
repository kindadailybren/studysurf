def createRefreshTokenCookie(response, refreshToken):
    max_age = 60 * 60 * 24 * 30  # 30 days in seconds

    response.set_cookie(
        key="refresh_token",
        value=refreshToken,
        httponly=True,
        secure=True,
        samesite="strict",
        path="/",
        max_age=max_age,
    )
