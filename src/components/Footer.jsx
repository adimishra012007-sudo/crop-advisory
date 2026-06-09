import Link from "next/link";

// Footer component showing copyright and primary footer links
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-350 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Footer Logo & Tagline */}
          <div className="text-center md:text-left">
            <Link href="/" className="flex items-center justify-center md:justify-start space-x-2">
              <span className="text-xl">🌱</span>
              <span className="font-extrabold text-white text-lg tracking-tight">
                AI Crop Advisory Chatbot
              </span>
            </Link>
            <p className="text-xs text-slate-400 mt-2 max-w-xs">
              Supporting sustainable agriculture and terrace farming in Uttarakhand using AI.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
            <Link href="/about" className="text-slate-400 hover:text-white transition duration-200">
              About Project
            </Link>
            <Link href="/contact" className="text-slate-400 hover:text-white transition duration-200">
              Contact Us
            </Link>
            <Link href="#" className="text-slate-400 hover:text-white transition duration-200">
              Privacy Policy
            </Link>
          </div>
        </div>

        <div className="border-t border-slate-800 my-8" />

        {/* Copyright & Disclaimer */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {currentYear} AI Crop Advisory Chatbot. All rights reserved.</p>
          <p>Made for Uttarakhand Farmers • Week 2 Frontend Project</p>
        </div>
      </div>
    </footer>
  );
}
