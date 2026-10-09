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
import {
  faBolt,
  faLock,
  faSpinner,
  faFilePdf,
  faPenNib,
  faLightbulb,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import "../../styles/App.css";

interface JobStatusData {
  job_id: string;
  status: string;
  summary_text?: string;
  video_url?: string;
  error_message?: string;
  prompt_text?: string;
  input_type?: string;
}

const SUGGESTED_TOPICS = [
  "How Photosynthesis Converts Sunlight into Energy",
  "Quantum Entanglement Explained Simply",
  "Newton's Three Laws of Motion with Examples",
  "Supply and Demand Curves and Market Equilibrium",
  "How Computer RAM and CPU Cache Memory Work",
  "Mitochondria and Cellular ATP Respiration",
];

const deriveTitleFromPrompt = (prompt: string): string => {
  const words = prompt.trim().split(/\s+/);
  const candidate = words.slice(0, 7).join(" ");
  if (candidate.length > 45 && candidate.includes(" ")) {
    return candidate.slice(0, 45).replace(/\s+\S*$/, "").trim();
  }
  return candidate.trim() || "Topic Study Short";
};

export const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const username = useAuthStore((state) => state.username);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);
  const setIsOpenSignIn = useLoginModalStore((state) => state.setIsOpenSignIn);

  const [inputMode, setInputMode] = useState<"pdf" | "prompt">("pdf");
  const [topicPrompt, setTopicPrompt] = useState<string>("");
  const [file, setFile] = useState<File[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string>("subway");
  const [selectedVoice, setSelectedVoice] = useState<string>("Matthew");

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isCheckingActiveJob, setIsCheckingActiveJob] = useState<boolean>(true);
  const [currentJob, setCurrentJob] = useState<JobStatusData | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const pollingRef = useRef<number | null>(null);

  // Restore any active in-progress job on mount / refresh
  useEffect(() => {
    if (isAuthLoading) {
      setIsCheckingActiveJob(true);
      return;
    }

    if (!username) {
      setIsCheckingActiveJob(false);
      return;
    }

    let isMounted = true;
    const restoreActiveJob = async () => {
      try {
        const response = await api.get("/jobs", {
          params: { username },
        });
        const allJobs: JobStatusData[] = response.data;
        if (Array.isArray(allJobs) && isMounted) {
          const activeJob = allJobs.find(
            (j) => j.status !== "COMPLETED" && j.status !== "FAILED"
          );
          if (activeJob) {
            setIsProcessing(true);
            setCurrentJob(activeJob);
            startJobPolling(activeJob.job_id);
          }
        }
      } catch (err) {
        console.error("Failed to restore active job:", err);
      } finally {
        if (isMounted) {
          setIsCheckingActiveJob(false);
        }
      }
    };

    restoreActiveJob();

    return () => {
      isMounted = false;
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [username, isAuthLoading]);

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

    if (inputMode === "pdf") {
      if (!file[0]) {
        setUploadError("Please select a study document (.pdf) first.");
        return;
      }
    } else {
      if (!topicPrompt.trim() || topicPrompt.trim().length < 10) {
        setUploadError(
          "Please enter a topic or concept description of at least 10 characters."
        );
        return;
      }
    }

    setIsProcessing(true);
    setUploadError(null);

    if (inputMode === "pdf") {
      setCurrentJob({ job_id: "init", status: "PENDING", input_type: "pdf" });

      try {
        const selectedDoc = file[0];

        // 1. Get Presigned S3 Upload URL from FastAPI
        const urlResponse = await api.post("/jobs/upload-url", {
          filename: selectedDoc.name,
          contentType: selectedDoc.type || "application/pdf",
        });

        const { job_id, upload_url, s3_key } = urlResponse.data;
        setCurrentJob({ job_id, status: "PENDING", input_type: "pdf" });

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
          input_type: "pdf",
        });

        // 4. Start real-time polling
        startJobPolling(job_id);
      } catch (err: any) {
        console.error("Job submission failed:", err);
        const msg =
          err.response?.data?.detail ||
          err.message ||
          "Failed to initiate video generation.";
        setUploadError(msg);
        setCurrentJob({
          job_id: "error",
          status: "FAILED",
          error_message: msg,
          input_type: "pdf",
        });
      }
    } else {
      // Prompt mode: Direct SQS pipeline dispatch without S3 upload
      const cleanPrompt = topicPrompt.trim();
      const derivedTitle = deriveTitleFromPrompt(cleanPrompt);
      const generatedJobId =
        "job-" + Date.now() + "-" + Math.random().toString(36).substring(2, 8);

      setCurrentJob({
        job_id: generatedJobId,
        status: "PENDING",
        prompt_text: cleanPrompt,
        input_type: "prompt",
      });

      try {
        await api.post("/jobs", {
          job_id: generatedJobId,
          username,
          filename: derivedTitle,
          style: selectedStyle,
          voice: selectedVoice,
          prompt_text: cleanPrompt,
          input_type: "prompt",
        });

        startJobPolling(generatedJobId);
      } catch (err: any) {
        console.error("Topic job submission failed:", err);
        const msg =
          err.response?.data?.detail ||
          err.message ||
          "Failed to initiate topic video generation.";
        setUploadError(msg);
        setCurrentJob({
          job_id: "error",
          status: "FAILED",
          error_message: msg,
          prompt_text: cleanPrompt,
          input_type: "prompt",
        });
      }
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
    setTopicPrompt("");
  };

  const isGenerateDisabled =
    inputMode === "pdf" ? file.length === 0 : topicPrompt.trim().length < 10;

  return (
    <div className="flex-1 flex flex-col items-center overflow-y-auto px-4 py-8 md:px-12 w-full max-w-6xl mx-auto">
      {/* Studio Header */}
      <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-[var(--primary-border)] pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-100">
            Create Study Short
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Transform notes, slides, or custom study topics into high-retention vertical videos.
          </p>
        </div>

        {!isAuthLoading && !username && (
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
      {isAuthLoading || isCheckingActiveJob ? (
        <div className="flex flex-col items-center justify-center p-20 gap-3 text-gray-400">
          <FontAwesomeIcon
            icon={faSpinner}
            className="text-3xl animate-spin text-[var(--highlight-text)]"
          />
          <p className="text-sm">Initializing studio session...</p>
        </div>
      ) : isProcessing && currentJob ? (
        <ProgressStepper
          status={currentJob.status}
          summaryText={currentJob.summary_text}
          videoUrl={currentJob.video_url}
          errorMessage={currentJob.error_message || uploadError || undefined}
          inputType={currentJob.input_type || (currentJob.prompt_text ? "prompt" : "pdf")}
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

          {/* Step 3: Input Mode Segmented Selector */}
          <div className="w-full flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[var(--highlight-bg)] text-[var(--highlight-text)] flex items-center justify-center text-xs font-bold">
                  3
                </span>
                <h3 className="text-base font-bold text-gray-200">
                  Select Study Input
                </h3>
              </div>
              <span className="text-xs text-gray-400">
                {inputMode === "pdf"
                  ? "Upload notes or slides (.pdf)"
                  : "Type any concept or study prompt"}
              </span>
            </div>

            {/* Segmented Control Tabs */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-black/40 border border-white/10 w-full max-w-md">
              <button
                type="button"
                onClick={() => {
                  setInputMode("pdf");
                  setUploadError(null);
                }}
                className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  inputMode === "pdf"
                    ? "bg-[var(--secondary-bg)] text-white shadow-md border border-white/10"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <FontAwesomeIcon
                  icon={faFilePdf}
                  className={inputMode === "pdf" ? "text-rose-400" : ""}
                />
                <span>Upload PDF Document</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setInputMode("prompt");
                  setUploadError(null);
                }}
                className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  inputMode === "prompt"
                    ? "bg-[var(--secondary-bg)] text-white shadow-md border border-white/10"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <FontAwesomeIcon
                  icon={faPenNib}
                  className={inputMode === "prompt" ? "text-cyan-400" : ""}
                />
                <span>Type a Topic / Prompt</span>
              </button>
            </div>

            {/* Tab 1: PDF Dropzone */}
            {inputMode === "pdf" ? (
              <FileDrop file={file} setFile={setFile} />
            ) : (
              /* Tab 2: Custom Topic / Prompt Textarea */
              <div className="w-full bg-[var(--secondary-bg)] border border-[var(--primary-border)] rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="topic-input"
                    className="text-sm font-semibold text-gray-200 flex items-center gap-2"
                  >
                    <FontAwesomeIcon
                      icon={faLightbulb}
                      className="text-amber-400"
                    />
                    What concept would you like explained?
                  </label>
                  <span
                    className={`text-xs ${
                      topicPrompt.length > 500
                        ? "text-amber-400 font-bold"
                        : "text-gray-500"
                    }`}
                  >
                    {topicPrompt.length} / 600 characters
                  </span>
                </div>

                <div className="relative">
                  <textarea
                    id="topic-input"
                    value={topicPrompt}
                    onChange={(e) => {
                      if (e.target.value.length <= 600) {
                        setTopicPrompt(e.target.value);
                      }
                    }}
                    placeholder="e.g. Explain how photosynthesis works and how plants convert sunlight into chemical energy for a high school biology class..."
                    rows={4}
                    className="w-full bg-black/40 border border-white/10 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl p-4 text-sm text-gray-100 placeholder:text-gray-500 outline-none transition-all resize-none leading-relaxed"
                  />
                </div>

                {/* Inspiration Quick Pills */}
                <div className="flex flex-col gap-2 pt-1 border-t border-white/5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                    <FontAwesomeIcon
                      icon={faWandMagicSparkles}
                      className="text-cyan-400 text-xs"
                    />
                    <span>Need inspiration? Try one of these:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_TOPICS.map((suggested) => (
                      <button
                        key={suggested}
                        type="button"
                        onClick={() => {
                          setTopicPrompt(suggested);
                          setUploadError(null);
                        }}
                        className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/40 text-gray-300 hover:text-cyan-300 transition-all cursor-pointer text-left"
                      >
                        {suggested}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

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
              disabled={isGenerateDisabled}
              className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-base transition-all duration-200 shadow-xl cursor-pointer ${
                !isGenerateDisabled
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