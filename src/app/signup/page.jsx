"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Button, Input, Toast, Loader } from "../../components/ui";
import { signup, isAuthenticated } from "../../lib/auth";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "farmer",
    district: "",
    state: "Uttarakhand",
    phone: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/profile");
    }
  }, [router]);

  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required.";
    if (!formData.email.trim()) errs.email = "Email is required.";
    if (!formData.password || formData.password.length < 6) {
      errs.password = "Password must be at least 6 characters long.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        location: {
          district: formData.district,
          state: formData.state
        },
        phone: formData.phone
      };

      await signup(payload);
      triggerToast("Account registered successfully!", "success");
      setTimeout(() => {
        router.push("/profile");
      }, 500);
    } catch (err) {
      console.error("Signup failed:", err);
      triggerToast(err.message || "Failed to create account.", "error");
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
            <span className="text-4xl block text-center">🌱</span>
            <h2 className="mt-4 text-center text-3xl font-extrabold text-slate-900 dark:text-slate-50">
              Create an Account
            </h2>
            <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
              Register as a farmer or advisor to access crop advisories.
            </p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                  Full Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Aditya Mishra"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-rose-500 font-semibold">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
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
                  placeholder="•••••••• (Min 6 chars)"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full"
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-rose-500 font-semibold">{errors.password}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-750 dark:text-slate-200 text-sm focus:outline-none focus:border-emerald-500 font-medium"
                  >
                    <option value="farmer">Farmer</option>
                    <option value="advisor">Advisor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="text"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                    District
                  </label>
                  <Input
                    id="district"
                    name="district"
                    type="text"
                    placeholder="Uttarkashi"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                    State
                  </label>
                  <Input
                    id="state"
                    name="state"
                    type="text"
                    placeholder="Uttarakhand"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
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
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>Sign Up</span>
                )}
              </Button>
            </div>
          </form>

          <div className="relative my-5 flex items-center justify-center">
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
              window.location.href = "http://localhost:5000/api/users/google";
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
            <span className="text-slate-500 dark:text-slate-400">Already have an account? </span>
            <Link href="/login" className="font-semibold text-emerald-600 hover:text-emerald-500 transition-colors">
              Log in here
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
