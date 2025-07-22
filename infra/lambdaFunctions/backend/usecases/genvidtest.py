from genvidtest import MoviePy  # replace with actual filename if different

if __name__ == "__main__":
    generator = MoviePy()

    video_input = {
        "filename": "input.mp4",  # Make sure this file exists in the output folder
        "summary_text": "This is a test summary.\nLine 2 of text.",
        "font_size": 32,
        "font_color": "white",
        "bg_color": "black",
        "position": "center"
    }

    generator.generate_video_with_text(video_input)
