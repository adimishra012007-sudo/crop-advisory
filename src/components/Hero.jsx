import Link from "next/link";

// Hero component for the landing page
export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-green-50/30 to-white py-20 sm:py-32">
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-amber-100/30 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Badge */}
        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 tracking-wide uppercase shadow-sm border border-emerald-200 mb-6">
          🏔️ Dedicated for Uttarakhand Farmers
        </span>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-none">
          AI-Powered{" "}
          <span className="bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">
            Crop Advisory Chatbot
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Helping Uttarakhand farmers get instant crop advisory support. Identify diseases, manage pests, and optimize yield for your hilly farms.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            href="/chatbot"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-xl text-white bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200"
          >
            Start Chatting
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5 ml-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a.75.75 0 0 1-1.074-.765 6.002 6.002 0 0 1 1.761-4.057C4.845 14.799 4 13.483 4 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
              />
            </svg>
          </Link>
          <Link
            href="/about"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-slate-200 text-base font-semibold rounded-xl text-slate-700 bg-white hover:bg-slate-50 shadow-sm hover:shadow transition duration-200"
          >
            Learn More
          </Link>
        </div>

        {/* Small Trust Info */}
        <div className="mt-8 flex justify-center items-center gap-6 text-sm text-slate-500">
          <span className="flex items-center gap-1">⏱️ 24/7 Availability</span>
          <span className="flex items-center gap-1">🗣️ Voice & Text Friendly</span>
          <span className="flex items-center gap-1">🏔️ local Hill Farming Guidance</span>
        </div>
      </div>
    </div>
  );
}
