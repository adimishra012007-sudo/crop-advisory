"use client";

import React, { useEffect } from "react";

/**
 * Reusable Dialog Modal Component.
 * Supports backdrop blurring, layout container centering, and Escape key listener bindings.
 *
 * @param {Object} props - The component properties.
 * @param {boolean} props.isOpen - Dictates if the modal container is visible.
 * @param {() => void} props.onClose - Action callback when clicked outside or escape key is pressed.
 * @param {string} [props.title] - Optional title text at the top header of the modal.
 * @param {React.ReactNode} props.children - Inner body layouts and features.
 */
export default function Modal({ isOpen, onClose, title, children }) {
  // Listen for the Escape key and toggle body overflow to prevent background scrolling.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay filter */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Content Container */}
      <div
        className="relative bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-lg overflow-hidden transform transition-all duration-300 scale-100 max-h-[90vh] flex flex-col z-10 animate-scale-in"
        role="dialog"
        aria-modal="true"
      >
        {/* Header toolbar */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4">
          <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            {title || "Notification"}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full cursor-pointer"
            aria-label="Close dialog modal"
          >
            <svg
              className="w-5 h-5"
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

        {/* Content body layout container */}
        <div className="px-6 py-5 overflow-y-auto flex-grow text-sm text-slate-600 dark:text-slate-300">
          {children}
        </div>
      </div>
    </div>
  );
}
