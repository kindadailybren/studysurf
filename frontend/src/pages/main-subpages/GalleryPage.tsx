import axios from "axios";
import { useState, useEffect } from "react";
import { VideoThumbnail } from "../../components/VideoThumnail";
import { useAuthStore } from "../../stores/authStore";
import { api } from "../../api/Api";

export const GalleryPage = () => {
  const username = useAuthStore((state) => (state.username));
  const [videoURLs, setVideoURLs] = useState<string[]>([]);

  useEffect(() => {
    const getVideos = async () => {
      try {
        const response = await api.post('/videos', null, {
          params: { username }
        });
        const data: string[] = response.data;
        setVideoURLs(data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error status:", error.response?.status);
          console.error("Error body:", error.response?.data);
        } else {
          console.error("Non-Axios error:", error);
        }
      }
    }
    if (username) {
      getVideos();
    }
  }, [username]);
  return (
    <>
      <div className="flex justify-center flex-1 p-10">
        <div className="grid grid-cols-3 gap-3 max-w-250 md:grid-cols-6">
          {videoURLs.map((url, index) => (
            <VideoThumbnail key={index} videoURL={url} />
          ))}
        </div>
      </div>
    </>
  );
}
