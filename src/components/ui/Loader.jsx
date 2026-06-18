import React from "react";

/**
 * Reusable Loading Spinner Component.
 * Supports configurable size presets and theme-specific color palettes.
 *
 * @param {Object} props - The component properties.
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Sizing option for the spinner border circle.
 * @param {'emerald' | 'white' | 'slate'} [props.color='emerald'] - Styling color palette theme.
 * @param {string} [props.className=''] - Additional inline classes.
 */
export default function Loader({
  size = "md",
  color = "emerald",
  className = "",
}) {
  // Size-specific dimensions and border widths
  const sizes = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  // Color-specific outline borders and focus accents matching agronomy themes
  const colors = {
    emerald:
      "border-slate-200 border-t-emerald-600 dark:border-slate-700 dark:border-t-emerald-400",
    white: "border-white/30 border-t-white",
    slate:
      "border-slate-200 border-t-slate-600 dark:border-slate-700 dark:border-t-slate-400",
  };

  return (
    <div
      className={`animate-spin rounded-full ${sizes[size]} ${colors[color]} ${className}`}
      role="status"
      aria-label="Loading progress"
    >
      {/* Screen reader visibility text */}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
