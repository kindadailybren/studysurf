import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useLoginModalStore } from "../../stores/loginModalStore";
import { api } from "../../api/Api";
import { FileDrop } from "../../components/uploadComponents/FileDrop";
import { SelectVideoStyle } from "../../components/uploadComponents/selectVideoStyle";
import { ProgressStepper } from "../../components/uploadComponents/ProgressStepper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faLock } from "@fortawesome/free-solid-svg-icons";
import "../../styles/App.css";

interface JobStatusData {
  job_id: string;
  status: string;
  summary_text?: string;
  video_url?: string;
  error_message?: string;
}

export const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const username = useAuthStore((state) => state.username);
  const setIsOpenSignIn = useLoginModalStore((state) => state.setIsOpenSignIn);

  const [file, setFile] = useState<File[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string>("subway");
  const [selectedVoice, setSelectedVoice] = useState<string>("Matthew");

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentJob, setCurrentJob] = useState<JobStatusData | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const pollingRef = useRef<number | null>(null);

  // Stop polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  const startJobPolling = (jobId: string) => {
    if (pollingRef.current) clearInterval(pollingRef.current);

    pollingRef.current = window.setInterval(async () => {
      try {
        const response = await api.get(`/jobs/${jobId}`, {
          params: { username },
        });
        const job: JobStatusData = response.data;
        setCurrentJob(job);

        if (job.status === "COMPLETED" || job.status === "FAILED") {
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
        }
      } catch (err) {
        console.error("Error polling job status:", err);
      }
    }, 3000);
  };

  const handleStartGeneration = async () => {
    if (!username) {
      setIsOpenSignIn(true);
      return;
    }

    if (!file[0]) {
      setUploadError("Please select a study document (.pdf) first.");
      return;
    }

    setIsProcessing(true);
    setUploadError(null);
    setCurrentJob({ job_id: "init", status: "PENDING" });

    try {
      const selectedDoc = file[0];

      // 1. Get Presigned S3 Upload URL from FastAPI
      const urlResponse = await api.post("/jobs/upload-url", {
        filename: selectedDoc.name,
        contentType: selectedDoc.type || "application/pdf",
      });

      const { job_id, upload_url, s3_key } = urlResponse.data;
      setCurrentJob({ job_id, status: "PENDING" });

      // 2. Upload PDF directly to S3 via presigned PUT
      await axios.put(upload_url, selectedDoc, {
        headers: {
          "Content-Type": selectedDoc.type || "application/pdf",
        },
      });

      // 3. Dispatch Job to SQS Ingestion Queue via FastAPI
      await api.post("/jobs", {
        job_id,
        username,
        filename: selectedDoc.name,
        style: selectedStyle,
        voice: selectedVoice,
        s3_key,
      });

      // 4. Start real-time polling
      startJobPolling(job_id);

    } catch (err: any) {
      console.error("Job submission failed:", err);
      const msg = err.response?.data?.detail || err.message || "Failed to initiate video generation.";
      setUploadError(msg);
      setCurrentJob({ job_id: "error", status: "FAILED", error_message: msg });
    }
  };

  const handleReset = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    setIsProcessing(false);
    setCurrentJob(null);
    setUploadError(null);
    setFile([]);
  };

  return (
    <div className="flex-1 flex flex-col items-center overflow-y-auto px-4 py-8 md:px-12 w-full max-w-6xl mx-auto">
      {/* Studio Header */}
      <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-[var(--primary-border)] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[var(--highlight-bg)] text-[var(--highlight-text)]">
              AI Video Studio
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-100">
            Create Study Short
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Transform notes, slides, and study guides into high-retention vertical videos.
          </p>
        </div>

        {!username && (
          <button
            onClick={() => setIsOpenSignIn(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-[var(--highlight-text)] text-sm text-[var(--highlight-text)] transition-colors w-fit"
          >
            <FontAwesomeIcon icon={faLock} />
            Sign in to Save Videos
          </button>
        )}
      </div>

      {/* Main Studio Area */}
      {isProcessing && currentJob ? (
        <ProgressStepper
          status={currentJob.status}
          summaryText={currentJob.summary_text}
          videoUrl={currentJob.video_url}
          errorMessage={currentJob.error_message || uploadError || undefined}
          onReset={handleReset}
          onViewGallery={() => navigate("/gallery")}
        />
      ) : (
        <div className="w-full flex flex-col gap-6">
          {/* Step 1 & 2: Style & Voice Selector */}
          <SelectVideoStyle
            selectedStyle={selectedStyle}
            setSelectedStyle={setSelectedStyle}
            selectedVoice={selectedVoice}
            setSelectedVoice={setSelectedVoice}
          />

          {/* Step 3: Document Upload Dropzone */}
          <FileDrop file={file} setFile={setFile} />

          {/* Error Message */}
          {uploadError && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
              {uploadError}
            </p>
          )}

          {/* Generate Button */}
          <div className="flex items-center justify-end pt-4 border-t border-[var(--primary-border)]">
            <button
              onClick={handleStartGeneration}
              disabled={file.length === 0}
              className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-base transition-all duration-200 shadow-xl cursor-pointer ${
                file.length > 0
                  ? "bg-[var(--highlight-text)] hover:bg-blue-500 text-black shadow-[var(--highlight-text)]/20 hover:scale-[1.02]"
                  : "bg-white/10 text-gray-500 cursor-not-allowed"
              }`}
            >
              <FontAwesomeIcon icon={faBolt} />
              Generate Study Short
            </button>
          </div>
        </div>
      )}
    </div>
  );
};