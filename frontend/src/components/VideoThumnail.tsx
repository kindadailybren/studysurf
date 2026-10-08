import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faXmark,
  faDownload,
  faClock,
  faFilm,
} from "@fortawesome/free-solid-svg-icons";

export interface VideoThumbnailProps {
  videoURL: string;
  title?: string;
  createdDate?: string;
  style?: string;
  summaryText?: string;
}

export const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  videoURL,
  title = "Study Short",
  createdDate,
  style = "subway",
  summaryText,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const formattedDate = createdDate
    ? new Date(createdDate).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently created";

  return (
    <>
      {/* Video Card */}
      <div
        className="group relative rounded-2xl overflow-hidden aspect-[9/16] bg-[var(--secondary-bg)] border border-[var(--primary-border)] hover:border-[var(--highlight-text)] cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[var(--highlight-text)]/10 flex flex-col justify-between p-3"
        onClick={handleOpen}
      >
        {/* Poster / Video Background Preview */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20 z-10" />
        <video
          src={videoURL}
          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
          preload="metadata"
          muted
        />

        {/* Top Badges */}
        <div className="relative z-20 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[var(--highlight-text)] border border-white/10">
            {style}
          </span>
          <div className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md text-white/80 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            <FontAwesomeIcon icon={faPlay} />
          </div>
        </div>

        {/* Bottom Title & Date */}
        <div className="relative z-20 text-left">
          <h3 className="text-sm font-bold text-gray-100 truncate group-hover:text-[var(--highlight-text)] transition-colors">
            {title}
          </h3>
          <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
            <FontAwesomeIcon icon={faClock} className="text-[9px]" />
            {formattedDate}
          </p>
        </div>
      </div>

      {/* Video Playback Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fade-in"
          onClick={handleClose}
        >
          <div
            className="relative bg-[var(--secondary-bg)] border border-[var(--primary-border)] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm z-30 transition-colors"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>

            {/* Video Player Column */}
            <div className="md:w-1/2 bg-black flex items-center justify-center p-2">
              <div className="w-full max-w-xs aspect-[9/16] rounded-xl overflow-hidden bg-black shadow-inner">
                <video
                  src={videoURL}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Video Metadata Column */}
            <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto text-left">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[var(--highlight-bg)] text-[var(--highlight-text)]">
                    {style.toUpperCase()} Short
                  </span>
                  <span className="text-xs text-gray-400">{formattedDate}</span>
                </div>

                <h2 className="text-2xl font-bold text-gray-100 mb-4">{title}</h2>

                {summaryText ? (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
                    <h4 className="text-xs font-semibold text-[var(--highlight-text)] mb-1 flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faFilm} /> AI Summary & Narration
                    </h4>
                    <p className="text-xs text-gray-300 leading-relaxed max-h-48 overflow-y-auto">
                      {summaryText}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 mb-4">
                    Rendered with synchronized kinetic typography and AI-enhanced narration.
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[var(--primary-border)] flex items-center gap-3">
                <a
                  href={videoURL}
                  download={`${title.replace(/\s+/g, "_")}.mp4`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-[var(--highlight-text)] hover:bg-blue-600 text-black font-bold text-sm rounded-xl transition-all shadow-md"
                >
                  <FontAwesomeIcon icon={faDownload} />
                  Download MP4
                </a>
                <button
                  onClick={handleClose}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-gray-200 text-sm font-semibold rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};