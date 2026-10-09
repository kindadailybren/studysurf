import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faExclamationTriangle,
  faFileLines,
  faBrain,
  faMicrophoneLines,
  faFilm,
  faCircleCheck,
  faXmark,
  faTrash,
  faLightbulb,
} from "@fortawesome/free-solid-svg-icons";
import { ProgressStepper } from "./uploadComponents/ProgressStepper";

export interface ActiveJobItem {
  job_id: string;
  username?: string;
  filename?: string;
  status: string;
  style?: string;
  voice?: string;
  summary_text?: string;
  video_url?: string;
  error_message?: string;
  created_at?: string;
  prompt_text?: string;
  input_type?: string;
}

interface GeneratingCardProps {
  job: ActiveJobItem;
  onDismissFailed?: (jobId: string) => void;
}

const getStepDetails = (status: string, isPrompt: boolean) => {
  switch (status) {
    case "PENDING":
    case "PROCESSING_DOCUMENT":
      return {
        label: isPrompt ? "Analyzing Topic" : "Ingesting PDF",
        icon: isPrompt ? faLightbulb : faFileLines,
        percent: 25,
      };
    case "SUMMARIZING":
      return {
        label: isPrompt ? "Writing Script" : "AI Summarizing",
        icon: faBrain,
        percent: 50,
      };
    case "SYNTHESIZING_VOICE":
      return { label: "Voice Synthesis", icon: faMicrophoneLines, percent: 70 };
    case "RENDERING_VIDEO":
      return { label: "Compositing Video", icon: faFilm, percent: 88 };
    case "COMPLETED":
      return { label: "Complete", icon: faCircleCheck, percent: 100 };
    default:
      return { label: "Initializing...", icon: faSpinner, percent: 15 };
  }
};

export const GeneratingCard: React.FC<GeneratingCardProps> = ({
  job,
  onDismissFailed,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isFailed = job.status === "FAILED";
  const isPrompt =
    job.input_type === "prompt" ||
    Boolean(job.prompt_text && !job.filename?.endsWith(".pdf"));
  const step = getStepDetails(job.status, isPrompt);

  const cleanFilename = job.filename
    ? job.filename.replace(".pdf", "").replace(/_/g, " ")
    : job.prompt_text
    ? job.prompt_text.slice(0, 35) + (job.prompt_text.length > 35 ? "..." : "")
    : "Study Short";

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDismissFailed) {
      onDismissFailed(job.job_id);
    }
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className={`group relative rounded-2xl overflow-hidden aspect-[9/16] cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between p-3.5 select-none ${
          isFailed
            ? "bg-[#140b0d] border border-red-500/40 hover:border-red-400 hover:shadow-red-500/10"
            : "bg-[#0c0e12] border border-cyan-500/30 hover:border-cyan-400/70 hover:shadow-cyan-500/10"
        }`}
      >
        {/* Subtle dark ambient animated glow */}
        {!isFailed && (
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-blue-500/10 pointer-events-none" />
        )}

        {/* Top Badges */}
        <div className="relative z-10 flex items-center justify-end">

          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs backdrop-blur-md ${
              isFailed
                ? "bg-red-500/20 text-red-400"
                : "bg-cyan-500/15 text-cyan-400"
            }`}
          >
            {isFailed ? (
              <FontAwesomeIcon icon={faExclamationTriangle} />
            ) : (
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
            )}
          </div>
        </div>

        {/* Center: Stage Progress or Failure Message */}
        <div className="relative z-10 flex flex-col items-center text-center my-auto px-1">
          {isFailed ? (
            <>
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 text-xl mb-2.5">
                <FontAwesomeIcon icon={faExclamationTriangle} />
              </div>
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                Generation Failed
              </span>
              <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 px-1">
                {job.error_message || "Error processing study material."}
              </p>
              <button
                onClick={handleDismiss}
                className="mt-3 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-white border border-red-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FontAwesomeIcon icon={faTrash} className="text-[10px]" />
                Dismiss
              </button>
            </>
          ) : (
            <>
              {/* Pulsing Icon */}
              <div className="relative mb-3">
                <div className="w-13 h-13 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-300 text-xl shadow-[0_0_15px_rgba(6,182,212,0.25)]">
                  <FontAwesomeIcon icon={step.icon} />
                </div>
                <div className="absolute -inset-1 rounded-2xl bg-cyan-500/20 blur-sm animate-pulse -z-10" />
              </div>

              {/* Step Label */}
              <span className="text-xs font-bold text-gray-200 tracking-wide">
                {step.label}
              </span>
              <span className="text-[10px] text-cyan-400/80 font-medium mt-0.5">
                Generating Video...
              </span>

              {/* Progress Bar */}
              <div className="w-full bg-zinc-800/80 rounded-full h-1.5 overflow-hidden mt-3 border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                  style={{ width: `${step.percent}%` }}
                />
              </div>

              <span className="text-[11px] font-bold text-cyan-400 mt-1">
                {step.percent}%
              </span>
            </>
          )}
        </div>

        {/* Bottom Details */}
        <div className="relative z-10 text-left pt-2 border-t border-white/5">
          <h4 className="text-xs font-bold text-gray-200 truncate group-hover:text-cyan-300 transition-colors">
            {cleanFilename}
          </h4>
          <p className="text-[10px] text-gray-500 mt-0.5 truncate">
            {isFailed
              ? "Click for error details"
              : "Click to view live stepper"}
          </p>
        </div>
      </div>

      {/* Detail Progress Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute -top-10 right-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm z-30 transition-colors cursor-pointer"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>

            <ProgressStepper
              status={job.status}
              summaryText={job.summary_text}
              videoUrl={job.video_url}
              errorMessage={job.error_message}
              inputType={job.input_type || (job.prompt_text ? "prompt" : "pdf")}
              onReset={() => {
                if (isFailed && onDismissFailed) {
                  onDismissFailed(job.job_id);
                }
                setIsModalOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};
