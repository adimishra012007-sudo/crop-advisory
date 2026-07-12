"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Button, Toast, Loader } from "../../components/ui";
import { logout, getToken, getUser, isAuthenticated } from "../../lib/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [cropsCount, setCropsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const token = getToken();

        // 1. Fetch user profile from backend
        const profileResponse = await fetch("http://localhost:5000/api/users/profile", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (profileResponse.status === 401) {
          triggerToast("Session expired. Logging out...", "error");
          logout();
          setTimeout(() => {
            router.push("/login");
          }, 1500);
          return;
        }

        if (!profileResponse.ok) {
          throw new Error("Failed to fetch dashboard user details.");
        }

        const userData = await profileResponse.json();
        setUser(userData);

        // 2. Fetch crops count from backend
        const cropsResponse = await fetch("http://localhost:5000/api/crops", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (cropsResponse.ok) {
          const cropsData = await cropsResponse.json();
          setCropsCount(cropsData.length);
        }
      } catch (err) {
        console.error("Dashboard data load failed:", err);
        // Fallback to local storage user cache if offline
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

    loadDashboardData();
  }, [router]);

  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const handleLogout = () => {
    logout();
    triggerToast("Logged out successfully!", "success");
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
            Loading your dashboard data...
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      <Navbar />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 max-w-5xl w-full mx-auto">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-8 shadow-sm space-y-8 animate-fadeIn">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center text-3xl border border-emerald-200">
                📊
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
                  Dashboard Overview
                </span>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 mt-1.5">
                  Welcome, {user?.name}!
                </h1>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" size="md" onClick={() => router.push("/profile")}>
                View Profile
              </Button>
              <Button variant="outline" size="md" onClick={handleLogout} className="cursor-pointer">
                Log Out
              </Button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Total Crops Card */}
            <div className="bg-slate-50/50 dark:bg-slate-900/50 border border-slate-150 dark:border-slate-800 p-5 rounded-2xl flex flex-col justify-between shadow-xs hover:border-emerald-200 dark:hover:border-emerald-900/60 transition duration-250">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">🌾</span>
                  <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-450 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded">
                    Registry
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Total Crops
                </h3>
              </div>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 mt-4">
                {cropsCount}
              </p>
            </div>

            {/* Chat Sessions Card */}
            <div className="bg-slate-50/50 dark:bg-slate-900/50 border border-slate-150 dark:border-slate-800 p-5 rounded-2xl flex flex-col justify-between shadow-xs hover:border-emerald-200 dark:hover:border-emerald-900/60 transition duration-250">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">💬</span>
                  <span className="text-[10px] uppercase font-bold text-sky-600 dark:text-sky-450 bg-sky-50 dark:bg-sky-950/30 px-2 py-0.5 rounded">
                    AI Assistant
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Chat Sessions
                </h3>
              </div>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 mt-4">
                3
              </p>
            </div>

            {/* Account Status Card */}
            <div className="bg-slate-50/50 dark:bg-slate-900/50 border border-slate-150 dark:border-slate-800 p-5 rounded-2xl flex flex-col justify-between shadow-xs hover:border-emerald-200 dark:hover:border-emerald-900/60 transition duration-250">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">🛡️</span>
                  <span className="text-[10px] uppercase font-bold text-green-600 dark:text-green-450 bg-green-50 dark:bg-green-950/30 px-2 py-0.5 rounded">
                    Status
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Account Status
                </h3>
              </div>
              <div className="mt-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-550/10 text-green-600 dark:text-green-400 border border-green-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* User Details Panel */}
          <div className="bg-slate-50/30 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-800/80 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-850 dark:text-slate-100 flex items-center gap-2">
              <span>👤</span> Farmer Credentials
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              <div>
                <strong className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-1">
                  Full Name
                </strong>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {user?.name}
                </p>
              </div>

              <div>
                <strong className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-1">
                  Email Address
                </strong>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {user?.email}
                </p>
              </div>

              <div>
                <strong className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-1">
                  Assigned Role
                </strong>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-450 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                  {user?.role}
                </span>
              </div>
            </div>
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
