import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { VideoThumbnail } from "../../components/VideoThumnail";
import { useAuthStore } from "../../stores/authStore";
import { useLoginModalStore } from "../../stores/loginModalStore";
import { api } from "../../api/Api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhotoFilm,
  faPlus,
  faSpinner,
  faLock,
} from "@fortawesome/free-solid-svg-icons";

interface VideoItem {
  video_id: string;
  video_url: string;
  title?: string;
  style?: string;
  created_at?: string;
}

export const GalleryPage: React.FC = () => {
  const navigate = useNavigate();
  const username = useAuthStore((state) => state.username);
  const setIsOpenSignIn = useLoginModalStore((state) => state.setIsOpenSignIn);

  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchVideos = async () => {
      if (!username) {
        setVideos([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await api.get("/videos", {
          params: { username },
        });

        const rawData = response.data;
        if (Array.isArray(rawData)) {
          const parsedVideos: VideoItem[] = rawData.map((item, idx) => {
            if (typeof item === "string") {
              return {
                video_id: `vid-${idx}`,
                video_url: item,
                title: `Study Short #${idx + 1}`,
                style: "subway",
              };
            }
            return item;
          });
          setVideos(parsedVideos);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Failed to load videos:", error.response?.data);
        } else {
          console.error("Non-Axios error:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [username]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-8 md:px-12 w-full max-w-7xl mx-auto">
      {/* Gallery Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-[var(--primary-border)] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[var(--highlight-bg)] text-[var(--highlight-text)]">
              Library
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-100">
            Video Gallery
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Browse and replay your generated study shorts with animated narration.
          </p>
        </div>

        {username && (
          <button
            onClick={() => navigate("/upload")}
            className="flex items-center gap-2 px-5 py-2.5 bg-[var(--highlight-text)] hover:bg-blue-500 text-black font-bold text-sm rounded-xl transition-all shadow-md w-fit cursor-pointer"
          >
            <FontAwesomeIcon icon={faPlus} />
            Create New Short
          </button>
        )}
      </div>

      {/* Content State */}
      {!username ? (
        <div className="flex flex-col items-center justify-center p-16 text-center border border-dashed border-[var(--primary-border)] rounded-2xl bg-[var(--secondary-bg)]/50 max-w-xl mx-auto my-12">
          <div className="w-16 h-16 rounded-full bg-[var(--highlight-bg)] text-[var(--highlight-text)] flex items-center justify-center text-2xl mb-4">
            <FontAwesomeIcon icon={faLock} />
          </div>
          <h2 className="text-xl font-bold text-gray-100 mb-2">
            Sign In to Access Your Gallery
          </h2>
          <p className="text-sm text-gray-400 mb-6 max-w-sm">
            Sign in with your StudySurf account to save, stream, and download your customized study videos.
          </p>
          <button
            onClick={() => setIsOpenSignIn(true)}
            className="px-6 py-2.5 bg-[var(--highlight-text)] hover:bg-blue-500 text-black font-bold text-sm rounded-xl transition-all"
          >
            Sign In Now
          </button>
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center p-20 gap-3 text-gray-400">
          <FontAwesomeIcon
            icon={faSpinner}
            className="text-3xl animate-spin text-[var(--highlight-text)]"
          />
          <p className="text-sm">Fetching your video collection...</p>
        </div>
      ) : videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 text-center border border-dashed border-[var(--primary-border)] rounded-2xl bg-[var(--secondary-bg)]/50 max-w-xl mx-auto my-12">
          <div className="w-16 h-16 rounded-full bg-white/5 text-gray-400 flex items-center justify-center text-2xl mb-4">
            <FontAwesomeIcon icon={faPhotoFilm} />
          </div>
          <h2 className="text-xl font-bold text-gray-100 mb-2">
            No Study Shorts Generated Yet
          </h2>
          <p className="text-sm text-gray-400 mb-6 max-w-sm">
            Upload your first lecture notes or PDF to craft a high-retention video short!
          </p>
          <button
            onClick={() => navigate("/upload")}
            className="flex items-center gap-2 px-6 py-2.5 bg-[var(--highlight-text)] hover:bg-blue-500 text-black font-bold text-sm rounded-xl transition-all cursor-pointer"
          >
            <FontAwesomeIcon icon={faPlus} />
            Create Your First Short
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {videos.map((vid) => (
            <VideoThumbnail
              key={vid.video_id}
              videoURL={vid.video_url}
              title={vid.title}
              style={vid.style}
              createdDate={vid.created_at}
            />
          ))}
        </div>
      )}
    </div>
  );
};
