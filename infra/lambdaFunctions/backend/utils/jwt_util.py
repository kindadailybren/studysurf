import jwt


def usernameFromIdToken(accessToken):
    decoded_token = jwt.decode(accessToken, options={"verify_signature": False})
    username = decoded_token.get("cognito:username")
    return username
