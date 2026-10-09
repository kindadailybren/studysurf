import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faXmark,
  faDownload,
  faClock,
  faFilm,
  faPen,
  faTrash,
  faCheck,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

export interface VideoThumbnailProps {
  videoId: string;
  videoURL: string;
  title?: string;
  description?: string;
  createdDate?: string;
  style?: string;
  summaryText?: string;
  onUpdate?: (
    videoId: string,
    newTitle: string,
    newDescription: string
  ) => Promise<void>;
  onDelete?: (videoId: string) => Promise<void>;
}

export const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  videoId,
  videoURL,
  title = "Study Short",
  description = "",
  createdDate,
  style = "subway",
  summaryText,
  onUpdate,
  onDelete,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleOpen = () => {
    setEditTitle(title);
    setEditDescription(description);
    setIsEditing(false);
    setShowDeleteConfirm(false);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsEditing(false);
    setShowDeleteConfirm(false);
    setIsOpen(false);
  };

  const handleSaveEdit = async () => {
    if (!onUpdate) return;
    setIsSaving(true);
    try {
      await onUpdate(videoId, editTitle.trim() || title, editDescription.trim());
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update video:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(videoId);
      setIsOpen(false);
    } catch (err) {
      console.error("Failed to delete video:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleQuickDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete "${title}" permanently?`)) {
      if (onDelete) {
        onDelete(videoId);
      }
    }
  };

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
        className="group relative rounded-2xl overflow-hidden aspect-[9/16] bg-[var(--secondary-bg)] border border-[var(--primary-border)] hover:border-[var(--highlight-text)] cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[var(--highlight-text)]/10 flex flex-col justify-between p-3 select-none"
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

        {/* Top Actions */}
        <div className="relative z-20 flex items-center justify-end">
          <div className="flex items-center gap-1.5">
            {/* Quick delete on hover */}
            {onDelete && (
              <button
                onClick={handleQuickDelete}
                title="Delete short"
                className="w-7 h-7 rounded-full bg-black/60 hover:bg-red-500/80 backdrop-blur-md text-white/80 hover:text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
              >
                <FontAwesomeIcon icon={faTrash} className="text-[10px]" />
              </button>
            )}
            <div className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md text-white/80 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
              <FontAwesomeIcon icon={faPlay} />
            </div>
          </div>
        </div>

        {/* Bottom Title & Date */}
        <div className="relative z-20 text-left">
          <h3 className="text-sm font-bold text-gray-100 truncate group-hover:text-[var(--highlight-text)] transition-colors">
            {title}
          </h3>
          {description && (
            <p className="text-[11px] text-gray-300/80 truncate mt-0.5">
              {description}
            </p>
          )}
          <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
            <FontAwesomeIcon icon={faClock} className="text-[9px]" />
            {formattedDate}
          </p>
        </div>
      </div>

      {/* Video Playback & Editing Modal */}
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
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm z-30 transition-colors cursor-pointer"
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
                {/* Header tags */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[var(--highlight-bg)] text-[var(--highlight-text)]">
                      {style.toUpperCase()} Short
                    </span>
                    <span className="text-xs text-gray-400">{formattedDate}</span>
                  </div>

                  {!isEditing && onUpdate && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-2.5 py-1 text-xs font-medium text-gray-300 hover:text-[var(--highlight-text)] bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faPen} className="text-[10px]" />
                      Edit Details
                    </button>
                  )}
                </div>

                {/* Edit Mode vs Display Mode */}
                {isEditing ? (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4 flex flex-col gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Video Title"
                        className="w-full px-3 py-1.5 bg-black/60 border border-white/20 focus:border-[var(--highlight-text)] rounded-lg text-sm text-gray-100 outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                        Description / Notes
                      </label>
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        rows={3}
                        placeholder="Add a custom description or notes..."
                        className="w-full px-3 py-1.5 bg-black/60 border border-white/20 focus:border-[var(--highlight-text)] rounded-lg text-xs text-gray-200 outline-none transition-colors resize-none"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => {
                          setEditTitle(title);
                          setEditDescription(description);
                          setIsEditing(false);
                        }}
                        disabled={isSaving}
                        className="px-3 py-1 text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        disabled={isSaving}
                        className="px-4 py-1.5 bg-[var(--highlight-text)] hover:bg-blue-500 text-black font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        {isSaving ? (
                          <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                        ) : (
                          <FontAwesomeIcon icon={faCheck} />
                        )}
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-100 mb-2 leading-tight">
                      {title}
                    </h2>
                    {description && (
                      <p className="text-xs text-gray-300 leading-relaxed mb-4 bg-white/5 border border-white/5 p-3 rounded-xl">
                        {description}
                      </p>
                    )}
                  </>
                )}

                {/* AI Summary Section */}
                {summaryText ? (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
                    <h4 className="text-xs font-semibold text-[var(--highlight-text)] mb-1 flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faFilm} /> AI Summary & Narration
                    </h4>
                    <p className="text-xs text-gray-300 leading-relaxed max-h-40 overflow-y-auto">
                      {summaryText}
                    </p>
                  </div>
                ) : !description && !isEditing && (
                  <p className="text-xs text-gray-400 mb-4">
                    Rendered with synchronized kinetic typography and AI-enhanced narration.
                  </p>
                )}

                {/* Delete Confirmation Alert */}
                {showDeleteConfirm && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 mb-4 flex flex-col gap-2.5">
                    <p className="text-xs font-medium">
                      Are you sure you want to permanently delete this study short?
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        {isDeleting && (
                          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-[10px]" />
                        )}
                        Yes, Delete
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        disabled={isDeleting}
                        className="px-3 py-1 bg-white/10 hover:bg-white/20 text-gray-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
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

                {onDelete && !showDeleteConfirm && (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2.5 bg-red-500/15 hover:bg-red-500/25 text-red-400 hover:text-red-300 border border-red-500/30 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                    title="Delete Video"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                )}

                <button
                  onClick={handleClose}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-gray-200 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
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