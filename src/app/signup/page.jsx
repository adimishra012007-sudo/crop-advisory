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
