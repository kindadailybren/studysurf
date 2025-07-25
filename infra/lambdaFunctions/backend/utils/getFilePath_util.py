import os
import tempfile

def get_temp_file_path(filename):
    if "AWS_LAMBDA_FUNCTION_NAME" in os.environ:
        return f"/tmp/{filename}"
    else:
        temp_dir = tempfile.gettempdir()
        return os.path.join(temp_dir, filename)