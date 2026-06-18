"use client";

import React, { useEffect } from "react";

/**
 * Reusable Alert Toast Notification Component.
 * Supports auto-dismiss and manual dismissal, success/error styling configurations, and accessibility rules.
 *
 * @param {Object} props - The component properties.
 * @param {string} props.message - The message description to render inside the alert.
 * @param {'success' | 'error'} [props.type='success'] - Visual styling variant (success or error alert).
 * @param {number} [props.duration=4000] - Lifespan in milliseconds before triggering the auto-dismiss callback.
 * @param {() => void} props.onClose - Action callback when clicked or when the timer expires.
 */
export default function Toast({
  message,
  type = "success",
  duration = 4000,
  onClose,
}) {
  // Setup automatic self-dismiss scheduler loop.
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const isSuccess = type === "success";

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center space-x-3 px-4 py-3 rounded-lg shadow-xl border text-sm font-semibold transition-all duration-300 animate-slide-in ${
        isSuccess
          ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/80 dark:border-emerald-800 dark:text-emerald-200"
          : "bg-red-50 border-red-200 text-red-800 dark:bg-red-950/80 dark:border-red-800 dark:text-red-200"
      }`}
      role="alert"
    >
      {/* Icon Graphic Indicator */}
      {isSuccess ? (
        <svg
          className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : (
        <svg
          className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      )}

      {/* Message Text Layout */}
      <span className="flex-grow">{message}</span>

      {/* Close Action Button */}
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors pl-1 cursor-pointer"
        aria-label="Dismiss message"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
