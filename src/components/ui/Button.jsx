import React from "react";

/**
 * Reusable Button component with multiple visual variants and size presets.
 * Supports loading states, disabling, and animation.
 *
 * @param {Object} props - The component properties.
 * @param {'primary' | 'secondary' | 'outline'} [props.variant='primary'] - The visual style variant.
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - The size option.
 * @param {boolean} [props.disabled=false] - Whether the button is disabled.
 * @param {() => void} [props.onClick] - Click handler function.
 * @param {React.ReactNode} props.children - The contents to be rendered inside the button.
 * @param {string} [props.className=''] - Additional Tailwind CSS classes to append.
 */
export default function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  children,
  className = "",
  ...props
}) {
  // Base classes for consistent interactive feedback and typography
  const baseClasses =
    "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

  // Visual variants for specific layout contexts
  const variants = {
    primary: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm focus:ring-emerald-500 border border-transparent",
    secondary:
      "bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100 focus:ring-slate-500 border border-transparent",
    outline:
      "border border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 focus:ring-emerald-500",
  };

  // Standard sizes mapping padding and font sizing
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
