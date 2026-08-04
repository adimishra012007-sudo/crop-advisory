import React from "react";

// Reusable card to showcase key chatbot functionalities
export default function FeatureCard({ title, description, icon }) {
  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-700/60 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden transform hover:-translate-y-1">
      {/* Decorative colored corner overlay */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-100/50 to-green-50/10 dark:from-emerald-900/30 dark:to-green-900/10 rounded-bl-full -z-10 group-hover:scale-110 transition duration-300" />
      
      <div>
        {/* Icon container */}
        <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center font-semibold text-2xl mb-6 shadow-inner group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/80 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition duration-300">
          {icon || "🌱"}
        </div>

        {/* Feature Title */}
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition duration-200">
          {title}
        </h3>

        {/* Feature Description */}
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
          {description}
        </p>
      </div>

      {/* Decorative arrow link indicator */}
      <div className="flex items-center text-sm font-semibold text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-800 dark:group-hover:text-emerald-300 transition duration-200 mt-2">
        Learn details
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition duration-200"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
          />
        </svg>
      </div>
    </div>
  );
}
