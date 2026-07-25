"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Button, Toast, Loader } from "../../components/ui";
import { logout, getToken, getUser, isAuthenticated } from "../../lib/auth";
import { getChatAnalytics } from "../../lib/api";

// Dynamically import heavy Chart.js components for client-side rendering
const Doughnut = dynamic(() => import("react-chartjs-2").then((mod) => mod.Doughnut), { ssr: false });
const Bar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Bar), { ssr: false });
const Line = dynamic(() => import("react-chartjs-2").then((mod) => mod.Line), { ssr: false });

// Register Chart.js elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Helper function to format dates for analytics cards
function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "N/A";
  return d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [cropsCount, setCropsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // Conversation Analytics state
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [analyticsError, setAnalyticsError] = useState(null);

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
            Authorization: `Bearer ${token}`,
          },
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
            Authorization: `Bearer ${token}`,
          },
        });
        if (cropsResponse.ok) {
          const cropsData = await cropsResponse.json();
          setCropsCount(cropsData.length);
        }
      } catch (err) {
        console.error("Dashboard data load failed:", err);
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

    const loadAnalyticsData = async () => {
      try {
        setLoadingAnalytics(true);
        setAnalyticsError(null);
        const data = await getChatAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.warn("Failed to load chat analytics:", err.message);
        setAnalyticsError(err.message || "Failed to load conversation analytics.");
      } finally {
        setLoadingAnalytics(false);
      }
    };

    loadDashboardData();
    loadAnalyticsData();
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

  // Chart 1 Data: Favorite vs Regular Conversations
  const doughnutData = {
    labels: ["Favorites ⭐", "Regular Chats 💬"],
    datasets: [
      {
        data: [
          analytics?.favoriteCount || 0,
          Math.max(0, (analytics?.totalConversations || 0) - (analytics?.favoriteCount || 0)),
        ],
        backgroundColor: ["#EAB308", "#10B981"],
        borderColor: ["#CA8A04", "#059669"],
        borderWidth: 1,
      },
    ],
  };

  // Chart 2 Data: Top Conversations by Message Count
  const barData = {
    labels: (analytics?.topConversations || []).map((c) =>
      c.title.length > 15 ? `${c.title.substring(0, 15)}...` : c.title
    ),
    datasets: [
      {
        label: "Messages Count",
        data: (analytics?.topConversations || []).map((c) => c.messageCount),
        backgroundColor: "#059669",
        borderRadius: 8,
      },
    ],
  };

  // Chart 3 Data: Conversation Growth Timeline
  const lineData = {
    labels: (analytics?.growthTimeline || []).map((g) => g.date),
    datasets: [
      {
        label: "Conversations Created",
        data: (analytics?.growthTimeline || []).map((g) => g.count),
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.15)",
        fill: true,
        tension: 0.3,
        pointBackgroundColor: "#059669",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#64748B",
          font: { size: 11, weight: "bold" },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#64748B", font: { size: 10 } },
      },
      y: {
        grid: { color: "#E2E8F0" },
        ticks: { color: "#64748B", font: { size: 10 }, precision: 0 },
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      <Navbar />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 max-w-6xl w-full mx-auto space-y-8">
        {/* Main Header Panel */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-8 shadow-sm space-y-8 animate-fadeIn">
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
              <Button variant="secondary" size="md" onClick={() => router.push("/chatbot")}>
                🤖 Open Chatbot
              </Button>
              <Button variant="outline" size="md" onClick={handleLogout} className="cursor-pointer">
                Log Out
              </Button>
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

        {/* Conversation Analytics Section */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-8 shadow-sm space-y-8">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
                AI Analytics
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-50 mt-1 flex items-center gap-2">
                <span>💬</span> Conversation Analytics
              </h2>
            </div>
          </div>

          {/* Skeleton Loaders during Analytics Fetching */}
          {loadingAnalytics ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-24 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse p-4 flex flex-col justify-between"
                >
                  <div className="w-16 h-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  <div className="w-10 h-6 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : analyticsError ? (
            <div className="p-6 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-2xl text-red-700 dark:text-red-400 text-sm">
              ⚠️ {analyticsError}
            </div>
          ) : (
            <>
              {/* 8 Statistic Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* 1. Total Conversations */}
                <div className="bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 p-4 rounded-2xl hover:border-emerald-300 transition">
                  <div className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                    Conversations
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 mt-2">
                    {analytics?.totalConversations || 0}
                  </div>
                  <span className="text-[10px] text-slate-400">Total sessions</span>
                </div>

                {/* 2. Total Messages */}
                <div className="bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 p-4 rounded-2xl hover:border-emerald-300 transition">
                  <div className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                    Total Messages
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 mt-2">
                    {analytics?.totalMessages || 0}
                  </div>
                  <span className="text-[10px] text-slate-400">All responses</span>
                </div>

                {/* 3. Favorites */}
                <div className="bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 p-4 rounded-2xl hover:border-yellow-400 transition">
                  <div className="text-xs font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-wider flex items-center gap-1">
                    <span>⭐</span> Favorites
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 mt-2">
                    {analytics?.favoriteCount || 0}
                  </div>
                  <span className="text-[10px] text-slate-400">Starred chats</span>
                </div>

                {/* 4. Pinned Chats */}
                <div className="bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 p-4 rounded-2xl hover:border-amber-400 transition">
                  <div className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <span>📌</span> Pinned
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 mt-2">
                    {analytics?.pinnedCount || 0}
                  </div>
                  <span className="text-[10px] text-slate-400">Pinned to top</span>
                </div>

                {/* 5. Average Messages */}
                <div className="bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 p-4 rounded-2xl hover:border-emerald-300 transition">
                  <div className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                    Avg Messages
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 mt-2">
                    {analytics?.averageMessagesPerConversation || 0}
                  </div>
                  <span className="text-[10px] text-slate-400">Per conversation</span>
                </div>

                {/* 6. Longest Conversation */}
                <div className="bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 p-4 rounded-2xl hover:border-emerald-300 transition">
                  <div className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                    Longest Chat
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 mt-2">
                    {analytics?.longestConversation || 0} <span className="text-xs font-normal">msgs</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Max length</span>
                </div>

                {/* 7. Oldest Conversation */}
                <div className="bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 p-4 rounded-2xl hover:border-emerald-300 transition">
                  <div className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                    Oldest Chat
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-50 mt-2 truncate">
                    {formatDate(analytics?.oldestConversationDate)}
                  </div>
                  <span className="text-[10px] text-slate-400">First activity</span>
                </div>

                {/* 8. Latest Conversation */}
                <div className="bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 p-4 rounded-2xl hover:border-emerald-300 transition">
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Latest Chat
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-50 mt-2 truncate">
                    {formatDate(analytics?.recentConversationDate)}
                  </div>
                  <span className="text-[10px] text-slate-400">Recent activity</span>
                </div>
              </div>

              {/* 3 Responsive Chart.js Visualizations */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                {/* Chart 1: Doughnut Chart */}
                <div className="bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
                  <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4 text-center">
                    Favorites Ratio
                  </h3>
                  <div className="h-56 relative flex items-center justify-center">
                    <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </div>

                {/* Chart 2: Bar Chart */}
                <div className="bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
                  <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4 text-center">
                    Top Chats by Messages
                  </h3>
                  <div className="h-56">
                    <Bar data={barData} options={chartOptions} />
                  </div>
                </div>

                {/* Chart 3: Line Chart */}
                <div className="bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
                  <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4 text-center">
                    Conversation Growth
                  </h3>
                  <div className="h-56">
                    <Line data={lineData} options={chartOptions} />
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
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
