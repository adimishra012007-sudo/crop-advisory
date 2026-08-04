import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// About page highlighting project mission and overview
export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Content Card */}
        <article className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-8 sm:p-12">
          
          {/* Header */}
          <div className="border-b border-slate-100 dark:border-slate-800 pb-8 mb-8 text-center sm:text-left">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider block mb-2">
              Our Vision
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
              About the Project
            </h1>
            <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm">
              AI-Powered Crop Advisory System for Uttarakhand Farmers
            </p>
          </div>

          {/* Project Overview */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span>🌾</span> Project Overview
            </h2>
            <p className="text-slate-650 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
              Uttarakhand farming is defined by its beautiful terraces, diverse altitude zones, and unique soil structures. However, farmers in remote districts like Pithoragarh, Almora, Chamoli, and Tehri face severe challenges. Information about plant diseases, pest management, and weather warnings is often delayed.
            </p>
            <p className="text-slate-650 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
              The <strong>AI-Powered Crop Advisory Chatbot</strong> is designed to bridge this information gap. By leveraging natural language processing, the chatbot intends to provide instant, region-specific, and crop-specific guidance directly to the farmers' mobile screens.
            </p>
          </section>

          {/* Mission Statement */}
          <section className="mt-12 bg-gradient-to-r from-emerald-50 to-green-50/50 dark:from-emerald-950/40 dark:to-green-950/20 p-6 sm:p-8 rounded-2xl border border-emerald-100/50 dark:border-emerald-900/40">
            <h2 className="text-lg font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 mb-3">
              <span>🎯</span> Mission Statement
            </h2>
            <p className="text-slate-700 dark:text-slate-200 leading-relaxed text-sm sm:text-base font-medium">
              "Our mission is to empower the hardworking farmers of Uttarakhand by offering 24/7 localized crop advisory support, helping them combat crop losses, adopt organic solutions, and improve agricultural sustainability."
            </p>
          </section>

          {/* Core Objectives */}
          <section className="mt-12">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
              <span>🚀</span> Core Objectives
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/55 dark:border-slate-700/60">
                <span className="text-2xl mb-2 block">🏔️</span>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1">Local Focus</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                  Tailoring advice to crops grown in hilly terrains like finger millet, amaranth, apples, and local pulses.
                </p>
              </div>
              <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/55 dark:border-slate-700/60">
                <span className="text-2xl mb-2 block">🌿</span>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1">Organic Native Advice</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                  Promoting chemical-free organic inputs, preserving biological variety, and keeping hill soils healthy.
                </p>
              </div>
            </div>
          </section>

        </article>
      </main>

      <Footer />
    </div>
  );
}
