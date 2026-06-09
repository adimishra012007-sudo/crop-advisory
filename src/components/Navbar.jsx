"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Reusable responsive navbar for AI Crop Advisory Chatbot
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Navigation Links array
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Chatbot", href: "/chatbot" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-emerald-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🌱</span>
              <span className="font-extrabold text-xl bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent tracking-tight">
                AI Crop Advisory
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-semibold transition-all duration-250 hover:text-emerald-600 px-3 py-2 rounded-md ${
                    isActive
                      ? "text-emerald-700 bg-emerald-50"
                      : "text-slate-600"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Side Options (Profile/User Icon) */}
          <div className="hidden md:flex items-center">
            <button className="flex items-center space-x-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 p-2 rounded-full transition-colors duration-200 border border-emerald-200">
              {/* Simple Profile Avatar SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 focus:outline-none transition"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                // Close icon SVG
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                // Hamburger icon SVG
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu, show/hide based on menu state */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-emerald-100 animate-fadeIn">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? "text-emerald-700 bg-emerald-50 font-bold"
                      : "text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            {/* Mobile Profile Display */}
            <div className="border-t border-emerald-100 pt-4 pb-2 px-3 flex items-center space-x-3">
              <div className="bg-emerald-100 text-emerald-800 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              </div>
              <span className="text-slate-700 font-semibold text-sm">Uttarakhand Farmer</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
