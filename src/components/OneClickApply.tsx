/**
 * OneClickApply - Quick Apply Button Component
 *
 * Features:
 * - Single click apply button for job cards
 * - Confirmation modal to review resume info
 * - Visual state for "already applied" status
 * - Multi-select batch apply mode
 * - Framer Motion animations
 */

import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useApply,
  type ApplicationStatus,
  type ResumeProfile,
} from "../stores/ApplyContext";

// ─── Types ───────────────────────────────────────────────────────

export interface JobItem {
  id: string;
  title: string;
  company: string;
  location?: string;
}

export interface OneClickApplyProps {
  /** Job ID for single apply mode */
  jobId?: string;
  /** Full job info for display in modal */
  job?: JobItem;
  /** Variant style */
  variant?: "primary" | "outline" | "ghost" | "compact";
  /** Button size */
  size?: "sm" | "md" | "lg";
  /** Enable batch selection mode (shows checkbox) */
  batchMode?: boolean;
  /** Whether this job is selected in batch mode */
  selected?: boolean;
  /** Callback when selection changes */
  onSelectChange?: (jobId: string, selected: boolean) => void;
  /** Custom className */
  className?: string;
  /** Callback after successful apply */
  onApplied?: (jobId: string) => void;
  /** Callback after batch apply */
  onBatchApplied?: (jobIds: string[]) => void;
}

export interface BatchApplyBarProps {
  /** Array of selected job IDs */
  selectedJobIds: string[];
  /** Job info for display in confirmation modal */
  jobs?: JobItem[];
  /** Callback to clear selection */
  onClear: () => void;
  /** Callback after batch apply completes */
  onBatchApplied?: (jobIds: string[]) => void;
}

// ─── Status Config ───────────────────────────────────────────────

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; color: string; bg: string; dotColor: string }
> = {
  pending: {
    label: "Pending",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    dotColor: "bg-yellow-500",
  },
  submitted: {
    label: "Submitted",
    color: "text-blue-600",
    bg: "bg-blue-50",
    dotColor: "bg-blue-500",
  },
  viewed: {
    label: "Viewed",
    color: "text-purple-600",
    bg: "bg-purple-50",
    dotColor: "bg-purple-500",
  },
  accepted: {
    label: "Accepted",
    color: "text-green-600",
    bg: "bg-green-50",
    dotColor: "bg-green-500",
  },
  rejected: {
    label: "Rejected",
    color: "text-red-600",
    bg: "bg-red-50",
    dotColor: "bg-red-500",
  },
};

// ─── Icon Components ─────────────────────────────────────────────

const SendIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
    />
  </svg>
);

const CheckIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const CloseIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const FileTextIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const BriefcaseIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const LoadingSpinner = ({ className = "w-4 h-4" }: { className?: string }) => (
  <motion.svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </motion.svg>
);

// ─── Confirmation Modal ──────────────────────────────────────────

interface ConfirmModalProps {
  job: JobItem;
  resumeProfile: ResumeProfile | null;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

function ConfirmModal({
  job,
  resumeProfile,
  onConfirm,
  onCancel,
  isSubmitting,
}: ConfirmModalProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        initial={{ scale: 0.85, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.85, y: 30, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">
                Quick Apply
              </h3>
              <p className="text-blue-100 text-sm mt-1">
                Review your application
              </p>
            </div>
            <button
              onClick={onCancel}
              className="text-blue-200 hover:text-white transition-colors"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Job Info */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <BriefcaseIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <h4 className="font-semibold text-gray-900 text-sm">
                {job.title}
              </h4>
              <p className="text-gray-500 text-xs mt-0.5">{job.company}</p>
              {job.location && (
                <p className="text-gray-400 text-xs mt-0.5">{job.location}</p>
              )}
            </div>
          </div>

          {/* Resume Profile */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Resume Profile
            </p>
            {resumeProfile ? (
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <FileTextIcon className="w-5 h-5 text-green-600" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 text-sm">
                    {resumeProfile.fullName}
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {resumeProfile.email}
                  </p>
                  <p className="text-green-600 text-xs mt-1 font-medium">
                    {resumeProfile.resumeFileName}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                  <FileTextIcon className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-yellow-800 font-medium">
                    No resume profile set
                  </p>
                  <p className="text-yellow-600 text-xs mt-0.5">
                    Go to profile to set up your resume
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 pt-0 flex gap-3">
          <motion.button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            disabled={isSubmitting}
          >
            Cancel
          </motion.button>
          <motion.button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner className="w-4 h-4" />
                Applying...
              </>
            ) : (
              <>
                <SendIcon className="w-4 h-4" />
                Confirm Apply
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Batch Confirmation Modal ────────────────────────────────────

interface BatchConfirmModalProps {
  jobs: JobItem[];
  resumeProfile: ResumeProfile | null;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

function BatchConfirmModal({
  jobs,
  resumeProfile,
  onConfirm,
  onCancel,
  isSubmitting,
}: BatchConfirmModalProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[85vh] flex flex-col"
        initial={{ scale: 0.85, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.85, y: 30, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">
                Batch Apply
              </h3>
              <p className="text-blue-100 text-sm mt-1">
                Review {jobs.length} selected {jobs.length === 1 ? "job" : "jobs"}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="text-blue-200 hover:text-white transition-colors"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable job list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Selected Jobs List */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Selected Jobs ({jobs.length})
            </p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {jobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-xs font-bold">{index + 1}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm truncate">
                      {job.title}
                    </h4>
                    <p className="text-gray-500 text-xs mt-0.5">{job.company}</p>
                    {job.location && (
                      <p className="text-gray-400 text-xs mt-0.5">{job.location}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Resume Profile */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Resume Profile
            </p>
            {resumeProfile ? (
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <FileTextIcon className="w-5 h-5 text-green-600" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 text-sm">
                    {resumeProfile.fullName}
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {resumeProfile.email}
                  </p>
                  <p className="text-green-600 text-xs mt-1 font-medium">
                    {resumeProfile.resumeFileName}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                  <FileTextIcon className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-yellow-800 font-medium">
                    No resume profile set
                  </p>
                  <p className="text-yellow-600 text-xs mt-0.5">
                    Go to profile to set up your resume
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 pt-0 flex gap-3 shrink-0">
          <motion.button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            disabled={isSubmitting}
          >
            Cancel
          </motion.button>
          <motion.button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner className="w-4 h-4" />
                Applying...
              </>
            ) : (
              <>
                <SendIcon className="w-4 h-4" />
                Apply to {jobs.length} {jobs.length === 1 ? "Job" : "Jobs"}
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Button Component ───────────────────────────────────────

const variantStyles = {
  primary: {
    base: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200",
    applied: "bg-green-100 text-green-700 cursor-default",
  },
  outline: {
    base: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
    applied: "border-2 border-green-300 text-green-600 cursor-default",
  },
  ghost: {
    base: "text-blue-600 hover:bg-blue-50",
    applied: "text-green-600 cursor-default",
  },
  compact: {
    base: "bg-blue-600 text-white hover:bg-blue-700 text-xs px-3 py-1.5",
    applied: "bg-green-100 text-green-700 text-xs px-3 py-1.5 cursor-default",
  },
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-4 py-2 text-sm rounded-xl",
  lg: "px-6 py-3 text-base rounded-xl",
};

export default function OneClickApply({
  jobId,
  job,
  variant = "primary",
  size = "md",
  batchMode = false,
  selected = false,
  onSelectChange,
  className = "",
  onApplied,
}: OneClickApplyProps): JSX.Element {
  const {
    hasApplied,
    applyJob,
    resumeProfile,
    getApplicationStatus,
  } = useApply();

  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justApplied, setJustApplied] = useState(false);

  const isApplied = jobId ? hasApplied(jobId) : false;
  const status: ApplicationStatus | null = jobId
    ? getApplicationStatus(jobId)
    : null;
  const statusConfig = status ? STATUS_CONFIG[status] : null;

  // ─── Handlers ────────────────────────────────────────────────

  const handleClick = useCallback(() => {
    if (batchMode && jobId && onSelectChange) {
      onSelectChange(jobId, !selected);
      return;
    }

    if (isApplied) return;

    if (job) {
      setShowModal(true);
    } else if (jobId) {
      // Direct apply without confirmation modal
      applyJob(jobId);
      setJustApplied(true);
      onApplied?.(jobId);
      setTimeout(() => setJustApplied(false), 2000);
    }
  }, [
    batchMode,
    jobId,
    onSelectChange,
    selected,
    isApplied,
    job,
    applyJob,
    onApplied,
  ]);

  const handleConfirm = useCallback(() => {
    if (!jobId) return;

    setIsSubmitting(true);

    // Simulate network request
    setTimeout(() => {
      applyJob(jobId);
      setIsSubmitting(false);
      setShowModal(false);
      setJustApplied(true);
      onApplied?.(jobId);
      setTimeout(() => setJustApplied(false), 2000);
    }, 800);
  }, [jobId, applyJob, onApplied]);

  const handleCancel = useCallback(() => {
    setShowModal(false);
  }, []);

  // ─── Render ──────────────────────────────────────────────────

  const baseStyles = "relative font-semibold inline-flex items-center justify-center gap-1.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-1";

  const currentVariant = isApplied
    ? variantStyles[variant].applied
    : variantStyles[variant].base;

  const currentSize = variant === "compact" ? "" : sizeStyles[size];

  return (
    <>
      <motion.button
        className={`${baseStyles} ${currentVariant} ${currentSize} ${className}`}
        onClick={handleClick}
        disabled={isApplied || isSubmitting}
        whileHover={!isApplied ? { scale: 1.04, y: -1 } : {}}
        whileTap={!isApplied ? { scale: 0.96 } : {}}
        layout
      >
        <AnimatePresence mode="wait">
          {batchMode && jobId && onSelectChange ? (
            // Checkbox mode
            <motion.div
              key="checkbox"
              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                selected
                  ? "bg-blue-600 border-blue-600"
                  : "border-current"
              }`}
              initial={false}
              animate={selected ? { scale: [1, 1.2, 1] } : {}}
            >
              {selected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <CheckIcon className="w-3 h-3 text-white" />
                </motion.div>
              )}
            </motion.div>
          ) : isApplied ? (
            // Applied state
            <motion.span
              key="applied"
              className="flex items-center gap-1.5"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <CheckIcon className="w-4 h-4" />
              {statusConfig?.label || "Applied"}
            </motion.span>
          ) : justApplied ? (
            // Just applied animation
            <motion.span
              key="just-applied"
              className="flex items-center gap-1.5"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <CheckIcon className="w-4 h-4" />
              Applied!
            </motion.span>
          ) : (
            // Default apply button
            <motion.span
              key="apply"
              className="flex items-center gap-1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SendIcon className="w-4 h-4" />
              Apply
            </motion.span>
          )}
        </AnimatePresence>

        {/* Success ripple effect */}
        {justApplied && (
          <motion.span
            className="absolute inset-0 rounded-xl bg-green-400/20"
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </motion.button>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showModal && job && (
          <ConfirmModal
            job={job}
            resumeProfile={resumeProfile}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Batch Apply Bar ─────────────────────────────────────────────

export function BatchApplyBar({
  selectedJobIds,
  jobs,
  onClear,
  onBatchApplied,
}: BatchApplyBarProps): JSX.Element | null {
  const { batchApply, resumeProfile } = useApply();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleOpenConfirm = useCallback(() => {
    setShowConfirm(true);
  }, []);

  const handleBatchApply = useCallback(() => {
    if (!selectedJobIds.length) return;

    setIsSubmitting(true);

    // Simulate network request
    setTimeout(() => {
      batchApply(selectedJobIds);
      setIsSubmitting(false);
      setShowConfirm(false);
      onBatchApplied?.(selectedJobIds);
      onClear();
    }, 1200);
  }, [selectedJobIds, batchApply, onBatchApplied, onClear]);

  const handleCancel = useCallback(() => {
    setShowConfirm(false);
  }, []);

  if (!selectedJobIds.length) return null;

  // Build job items for the confirmation modal
  const selectedJobItems = jobs
    ? jobs.filter((j) => selectedJobIds.includes(j.id))
    : selectedJobIds.map((id) => ({ id, title: `Job #${id}`, company: "" }));

  return (
    <motion.div
      className="fixed bottom-6 left-1/2 z-40"
      initial={{ y: 100, x: "-50%", opacity: 0 }}
      animate={{ y: 0, x: "-50%", opacity: 1 }}
      exit={{ y: 100, x: "-50%", opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
    >
      <div className="bg-gray-900 text-white rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-6">
        {/* Selection count */}
        <div className="flex items-center gap-3">
          <motion.div
            key={selectedJobIds.length}
            initial={{ scale: 1.4 }}
            animate={{ scale: 1 }}
            className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold"
          >
            {selectedJobIds.length}
          </motion.div>
          <span className="text-sm font-medium text-gray-200">
            {selectedJobIds.length === 1 ? "job selected" : "jobs selected"}
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-700" />

        {/* Actions */}
        <div className="flex items-center gap-3">
          <motion.button
            onClick={onClear}
            className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-800"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Clear
          </motion.button>

          <motion.button
            onClick={handleOpenConfirm}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl text-sm font-semibold transition-colors"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <SendIcon className="w-4 h-4" />
            Apply All
          </motion.button>
        </div>
      </div>

      {/* Batch Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <BatchConfirmModal
            jobs={selectedJobItems}
            resumeProfile={resumeProfile}
            onConfirm={handleBatchApply}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Application Status Badge ────────────────────────────────────

export interface StatusBadgeProps {
  status: ApplicationStatus;
  showDot?: boolean;
}

export function StatusBadge({ status, showDot = true }: StatusBadgeProps): JSX.Element {
  const config = STATUS_CONFIG[status];

  return (
    <motion.span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color} ${config.bg}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", damping: 20 }}
    >
      {showDot && (
        <motion.span
          className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      {config.label}
    </motion.span>
  );
}

// ─── Apply With Status ───────────────────────────────────────────

export interface ApplyWithStatusProps {
  jobId: string;
  job?: JobItem;
  variant?: OneClickApplyProps["variant"];
  size?: OneClickApplyProps["size"];
  className?: string;
  onApplied?: (jobId: string) => void;
  showStatusBadge?: boolean;
}

/** Combined button + status badge component */
export function ApplyWithStatus({
  jobId,
  job,
  variant = "primary",
  size = "md",
  className = "",
  onApplied,
  showStatusBadge = true,
}: ApplyWithStatusProps): JSX.Element {
  const { hasApplied, getApplicationStatus } = useApply();
  const isApplied = hasApplied(jobId);
  const status = getApplicationStatus(jobId);

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <OneClickApply
        jobId={jobId}
        job={job}
        variant={variant}
        size={size}
        onApplied={onApplied}
      />
      {showStatusBadge && isApplied && status && (
        <StatusBadge status={status} />
      )}
    </div>
  );
}
