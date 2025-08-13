from botocore.exceptions import ClientError


class DbUseCase:
    def __init__(self, dynamodb_service):
        self.db = dynamodb_service

    def retrieveVideoFromDb(self, username):
        try:
            videoLinks = self.db.retrieveVideoFromDb(username)

            videoLinksResponse = [
                link["videoUrl"]["S"]
                for link in videoLinks.get("Items", [])
                if "videoUrl" in link
            ]

            return videoLinksResponse

        except ClientError as err:
            raise err
