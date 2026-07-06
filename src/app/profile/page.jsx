"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Button, Toast, Loader } from "../../components/ui";
import { logout, getToken, getUser, isAuthenticated } from "../../lib/auth";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = getToken();
        const response = await fetch("http://localhost:5000/api/users/profile", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error("Session expired or invalid.");
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch backend profile, falling back to local storage:", err);
        // Fallback to local storage cache
        const localUser = getUser();
        if (localUser) {
          setUser(localUser);
        } else {
          logout();
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    logout();
    setToast({ show: true, message: "Logged out successfully!", type: "success" });
    setTimeout(() => {
      router.push("/");
    }, 500);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center py-24 gap-4">
          <Loader size="lg" color="emerald" />
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium animate-pulse">
            Loading your farmer profile...
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      <Navbar />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 max-w-4xl w-full mx-auto">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-8 shadow-sm space-y-8 animate-fadeIn">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center text-3xl border border-emerald-200">
                👨‍🌾
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
                  {user?.role || "Farmer"}
                </span>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 mt-1.5">
                  {user?.name}
                </h1>
              </div>
            </div>
            <Button variant="secondary" size="md" onClick={handleLogout} className="cursor-pointer">
              Log Out
            </Button>
          </div>

          {/* Profile Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 p-4 rounded-xl">
              <strong className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">
                Email Address
              </strong>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{user?.email}</p>
            </div>

            <div className="space-y-1 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 p-4 rounded-xl">
              <strong className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">
                Phone Number
              </strong>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {user?.phone || "Not provided"}
              </p>
            </div>

            <div className="space-y-1 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 p-4 rounded-xl">
              <strong className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">
                District / Location
              </strong>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {user?.location?.district || "Not specified"}
              </p>
            </div>

            <div className="space-y-1 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 p-4 rounded-xl">
              <strong className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">
                State
              </strong>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {user?.location?.state || "Uttarakhand"}
              </p>
            </div>
          </div>

          {/* Regional Information Alert */}
          <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 p-5 rounded-2xl">
            <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 mb-2">
              <span>🌾</span> Welcome to the Hills Advisory
            </h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed font-medium">
              Your profile is verified under Uttarakhand farming districts. The AI chatbot is optimized to recommend soil, season, and water solutions tailored for step terrace farming in districts like {user?.location?.district || "Uttarkashi"}.
            </p>
          </div>
        </div>
      </main>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        />
      )}

      <Footer />
    </div>
  );
}
