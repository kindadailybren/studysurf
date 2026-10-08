import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faSpinner,
  faExclamationTriangle,
  faFileLines,
  faBrain,
  faMicrophoneLines,
  faFilm,
  faCircleCheck,
  faLightbulb,
} from "@fortawesome/free-solid-svg-icons";

export interface ProgressStepperProps {
  status: string;
  summaryText?: string;
  videoUrl?: string;
  errorMessage?: string;
  inputType?: "pdf" | "prompt" | string;
  onReset?: () => void;
  onViewGallery?: () => void;
}

const getStepIndex = (status: string): number => {
  switch (status) {
    case "PENDING":
      return 0;
    case "PROCESSING_DOCUMENT":
      return 0;
    case "SUMMARIZING":
      return 1;
    case "SYNTHESIZING_VOICE":
      return 2;
    case "RENDERING_VIDEO":
      return 3;
    case "COMPLETED":
      return 4;
    default:
      return 0;
  }
};

const getPercentage = (status: string): number => {
  switch (status) {
    case "PENDING":
      return 10;
    case "PROCESSING_DOCUMENT":
      return 25;
    case "SUMMARIZING":
      return 50;
    case "SYNTHESIZING_VOICE":
      return 70;
    case "RENDERING_VIDEO":
      return 88;
    case "COMPLETED":
      return 100;
    default:
      return 10;
  }
};

export const ProgressStepper: React.FC<ProgressStepperProps> = ({
  status,
  summaryText,
  videoUrl,
  errorMessage,
  inputType = "pdf",
  onReset,
  onViewGallery,
}) => {
  const isPrompt = inputType === "prompt";
  const steps = [
    {
      key: "PROCESSING_DOCUMENT",
      label: isPrompt ? "Analyzing Topic" : "Ingesting PDF",
      description: isPrompt ? "Structuring prompt for video script" : "Extracting readable study text",
      icon: isPrompt ? faLightbulb : faFileLines,
    },
    {
      key: "SUMMARIZING",
      label: isPrompt ? "Script Writing" : "AI Summarization",
      description: "Distilling topic with Claude 3 Haiku",
      icon: faBrain,
    },
    {
      key: "SYNTHESIZING_VOICE",
      label: "Voice Synthesis",
      description: "Generating Amazon Polly neural speech",
      icon: faMicrophoneLines,
    },
    {
      key: "RENDERING_VIDEO",
      label: "Video Compositing",
      description: "Stitching background & synced subtitles",
      icon: faFilm,
    },
    {
      key: "COMPLETED",
      label: "Shorts Ready",
      description: "Processed and saved to gallery",
      icon: faCircleCheck,
    },
  ];

  const currentIndex = getStepIndex(status);
  const isFailed = status === "FAILED";
  const isDone = status === "COMPLETED";
  const percentage = isFailed ? 0 : getPercentage(status);

  return (
    <div className="w-full max-w-3xl bg-[var(--secondary-bg)] border border-[var(--primary-border)] rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--primary-border)] pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
            {isDone ? (
              <span className="text-emerald-400">Video Generation Complete!</span>
            ) : isFailed ? (
              <span className="text-red-400">Generation Failed</span>
            ) : (
              <span>Crafting Your Study Short...</span>
            )}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Asynchronous Cloud Pipeline • Bedrock + Polly + MoviePy
          </p>
        </div>

        <div className="text-right">
          <span className="text-2xl font-bold text-[var(--highlight-text)]">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full transition-all duration-700 ease-out ${
            isFailed
              ? "bg-red-500"
              : isDone
              ? "bg-emerald-400"
              : "bg-gradient-to-r from-sky-500 to-[var(--highlight-text)]"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Error View */}
      {isFailed && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 flex items-start gap-3">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-xl mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold text-sm">Processing Encountered an Issue</h4>
            <p className="text-xs text-red-200 mt-1">
              {errorMessage ||
                (isPrompt
                  ? "An unexpected error occurred during rendering. Please retry with a revised topic prompt."
                  : "An unexpected error occurred during rendering. Please retry with a valid PDF.")}
            </p>
            {onReset && (
              <button
                onClick={onReset}
                className="mt-3 px-4 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      )}

      {/* Stepper Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {steps.map((step, idx) => {
          const isCurrent = idx === currentIndex && !isDone && !isFailed;
          const isPassed = idx < currentIndex || isDone;

          return (
            <div
              key={step.key}
              className={`p-3 rounded-xl border flex flex-col justify-between transition-all duration-300 ${
                isCurrent
                  ? "border-[var(--highlight-text)] bg-[var(--highlight-bg)] ring-1 ring-[var(--highlight-text)]"
                  : isPassed
                  ? "border-emerald-500/40 bg-emerald-500/5 text-gray-200"
                  : "border-white/5 bg-white/2 opacity-40 text-gray-400"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                    isPassed
                      ? "bg-emerald-500 text-black font-bold"
                      : isCurrent
                      ? "bg-[var(--highlight-text)] text-black"
                      : "bg-white/10 text-gray-400"
                  }`}
                >
                  {isPassed ? (
                    <FontAwesomeIcon icon={faCheck} />
                  ) : isCurrent ? (
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>
                <FontAwesomeIcon
                  icon={step.icon}
                  className={`text-sm ${
                    isCurrent ? "text-[var(--highlight-text)]" : "text-gray-400"
                  }`}
                />
              </div>

              <div>
                <h4 className="text-xs font-semibold leading-tight">{step.label}</h4>
                <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live AI Summary Preview */}
      {summaryText && (
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-left">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-[var(--highlight-text)]">
            <FontAwesomeIcon icon={faBrain} />
            <span>
              {isPrompt
                ? "Generated Script Narration (Bedrock Claude 3):"
                : "AI Summarization Preview (Bedrock Claude 3):"}
            </span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed italic line-clamp-4">
            "{summaryText}"
          </p>
        </div>
      )}

      {/* Completion View & Actions */}
      {isDone && videoUrl && (
        <div className="flex flex-col items-center gap-4 pt-2">
          <div className="w-full max-w-sm aspect-[9/16] rounded-xl overflow-hidden bg-black shadow-2xl border border-[var(--primary-border)]">
            <video
              src={videoUrl}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex items-center gap-3">
            {onViewGallery && (
              <button
                onClick={onViewGallery}
                className="px-6 py-2.5 bg-[var(--highlight-text)] hover:bg-blue-600 text-black font-bold text-sm rounded-xl transition-all shadow-lg"
              >
                Go to Video Gallery
              </button>
            )}
            {onReset && (
              <button
                onClick={onReset}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-gray-200 font-semibold text-sm rounded-xl transition-all"
              >
                Generate Another Video
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
