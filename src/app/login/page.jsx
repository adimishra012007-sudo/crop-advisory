"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Button, Input, Toast, Loader } from "../../components/ui";
import { login, isAuthenticated } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    // If already authenticated, redirect to profile immediately
    if (isAuthenticated()) {
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
