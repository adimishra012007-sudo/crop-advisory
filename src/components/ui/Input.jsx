import React from "react";

/**
 * Reusable text input field with optional floating label and error message block.
 *
 * @param {Object} props - The component properties.
 * @param {string} [props.label] - Optional text label displayed above the input.
 * @param {string} [props.placeholder] - Placeholder text for the input field.
 * @param {string} [props.type='text'] - HTML input type attribute (e.g. 'text', 'number', 'email').
 * @param {string | number} props.value - The current value of the input field.
 * @param {(e: React.ChangeEvent<HTMLInputElement>) => void} props.onChange - Event handler for input changes.
 * @param {string} [props.error] - Optional validation error message display text.
 * @param {string} [props.className=''] - Additional wrapping container CSS classes.
 */
export default function Input({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  error,
  className = "",
  ...props
}) {
  const inputId = React.useId();

  return (
    <div className={`flex flex-col space-y-1.5 w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 border rounded-lg shadow-sm text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 dark:bg-slate-900 dark:text-slate-100 ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-400"
            : "border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 dark:border-slate-700"
        }`}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400 font-semibold mt-0.5 animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
}
