import React from "react";
import { useDropzone } from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudArrowUp,
  faFilePdf,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

interface FileDropProps {
  file: File[];
  setFile: (file: File[]) => void;
}

export const FileDrop: React.FC<FileDropProps> = ({ file, setFile }) => {
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile([acceptedFiles[0]]);
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile([]);
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "application/pdf": [".pdf"],
      },
      maxFiles: 1,
      multiple: false,
    });

  const selectedFile = file[0];

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
          <span className="text-[var(--highlight-text)]">3.</span> Upload Study Document
        </h2>
        <span className="text-xs text-gray-400">PDFs up to 50 MB supported</span>
      </div>

      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[180px] ${
          isDragActive
            ? "border-[var(--highlight-text)] bg-[var(--highlight-bg)]/80 scale-[1.01]"
            : isDragReject
            ? "border-red-500 bg-red-500/10"
            : selectedFile
            ? "border-emerald-500/60 bg-emerald-500/5 hover:border-emerald-500"
            : "border-[var(--primary-border)] bg-[var(--secondary-bg)] hover:border-[var(--highlight-text)]/60 hover:bg-[var(--secondary-bg-hvr)]"
        }`}
      >
        <input {...getInputProps()} />

        {selectedFile ? (
          <div className="flex items-center justify-between gap-4 w-full max-w-md bg-white/5 border border-white/10 rounded-xl p-4 transition-all">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center flex-shrink-0 text-xl">
                <FontAwesomeIcon icon={faFilePdf} />
              </div>
              <div className="text-left overflow-hidden">
                <p className="text-sm font-semibold text-gray-200 truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-400">
                  {formatFileSize(selectedFile.size)} • PDF ready for AI summarization
                </p>
              </div>
            </div>
            <button
              onClick={clearFile}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-gray-400 flex items-center justify-center transition-colors"
              title="Remove file"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-[var(--highlight-bg)] text-[var(--highlight-text)] flex items-center justify-center text-2xl shadow-inner">
              <FontAwesomeIcon icon={faCloudArrowUp} />
            </div>
            <div>
              <p className="text-base font-semibold text-gray-200">
                {isDragActive
                  ? "Drop your study document here..."
                  : "Drag & drop your study PDF here, or click to browse"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Lecture slides, syllabus, textbook chapters, or study guides (.pdf)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
