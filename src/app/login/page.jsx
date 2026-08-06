"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Button, Input, Toast, Loader } from "../../components/ui";
import { login, isAuthenticated } from "../../lib/auth";
import { getApiBaseUrl } from "../../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const tokenParam = queryParams.get("token");
    const errorParam = queryParams.get("error");

    if (errorParam) {
      if (errorParam === "cancelled") {
        triggerToast("Google authentication was cancelled.", "error");
      } else if (errorParam === "expired") {
        triggerToast("Session expired. Please log in again.", "error");
      } else {
        triggerToast(`Google authentication failed: ${errorParam}`, "error");
      }
      // Clean up URL
      router.replace("/login");
    } else if (tokenParam) {
      setLoading(true);
      localStorage.setItem("authToken", tokenParam);
      
      const fetchGoogleProfile = async () => {
        try {
          const response = await fetch(`${getApiBaseUrl()}/api/users/profile`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${tokenParam}`
            }
          });

          if (!response.ok) {
            throw new Error("Failed to fetch Google profile.");
          }

          const userData = await response.json();
          localStorage.setItem("authUser", JSON.stringify(userData));
          window.dispatchEvent(new Event("auth-change"));
          triggerToast("Successfully signed in with Google!", "success");
          
          setTimeout(() => {
            router.push("/profile");
          }, 800);
        } catch (err) {
          console.error(err);
          triggerToast("Google authentication failed. Please try again.", "error");
          localStorage.removeItem("authToken");
          localStorage.removeItem("authUser");
          window.dispatchEvent(new Event("auth-change"));
        } finally {
          setLoading(false);
        }
      };

      fetchGoogleProfile();
    } else if (isAuthenticated()) {
      router.push("/profile");
    }
  }, [router]);

  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = "Email is required.";
    if (!password) errs.password = "Password is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await login(email, password);
      triggerToast("Logged in successfully!", "success");
      // Redirect to profile page after short delay
      setTimeout(() => {
        router.push("/profile");
      }, 500);
    } catch (err) {
      console.error("Login failed:", err);
      triggerToast(err.message || "Invalid credentials.", "error");
      if (err.details) {
        setErrors(err.details);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm animate-fadeIn">
          <div>
            <span className="text-4xl block text-center">🌾</span>
            <h2 className="mt-4 text-center text-3xl font-extrabold text-slate-900 dark:text-slate-50">
              Welcome Back
            </h2>
            <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
              Log in to access your farmer profile and chatbot history.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  className="w-full"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-rose-500 font-semibold">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                  }}
                  className="w-full"
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-rose-500 font-semibold">{errors.password}</p>
                )}
              </div>
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 shadow-sm hover:shadow"
              >
                {loading ? (
                  <>
                    <Loader size="sm" color="white" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </Button>
            </div>
          </form>

          <div className="relative my-6 flex items-center justify-center">
            <span className="absolute inset-x-0 h-px bg-slate-200 dark:bg-slate-800"></span>
            <span className="relative bg-white dark:bg-slate-900 px-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Or continue with
            </span>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() => {
              window.location.href = `${getApiBaseUrl()}/api/users/google`;
            }}
            className="w-full flex justify-center items-center gap-2 border border-slate-200/80 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-sm font-semibold shadow-xs"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google</span>
          </Button>

          <div className="text-center text-sm border-t border-slate-100 dark:border-slate-800 pt-6">
            <span className="text-slate-500 dark:text-slate-400">Don't have an account? </span>
            <Link href="/signup" className="font-semibold text-emerald-600 hover:text-emerald-500 transition-colors">
              Sign up here
            </Link>
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
