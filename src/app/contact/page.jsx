"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// Contact page containing feedback form UI and advisory office support numbers
export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    // Simulate frontend form submission
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });

    // Reset status after a few seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-10">
        
        {/* Left Side: Contact Information Cards */}
        <section className="w-full lg:w-[40%] space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <span className="text-emerald-600 font-bold text-xs uppercase tracking-wider block mb-2">
              Get In Touch
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
              Contact Us
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Have any questions, feedback, or suggestions regarding the crop advisory chatbot? Please reach out to our project team.
            </p>
          </div>

          {/* Regional Help Contacts */}
          <div className="bg-gradient-to-br from-emerald-800 to-green-950 text-white p-8 rounded-3xl shadow-md space-y-6">
            <h3 className="font-bold text-lg border-b border-emerald-700/60 pb-3 flex items-center gap-2">
              <span>📞</span> Regional Agri-Helplines
            </h3>
            
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-semibold text-emerald-300">Uttarakhand Farmer Helpline</p>
                <p className="text-lg font-bold">1800-180-1551</p>
                <p className="text-xs text-emerald-200">Toll-free, 9:00 AM - 5:00 PM</p>
              </div>

              <div>
                <p className="font-semibold text-emerald-300">GB Pant University Advisory</p>
                <p className="text-lg font-bold">05944-233340</p>
                <p className="text-xs text-emerald-200">Pantnagar Hill Agriculture Division</p>
              </div>

              <div>
                <p className="font-semibold text-emerald-300">Krishi Vigyan Kendra (KVK)</p>
                <p className="text-sm font-medium">Dehradun / Almora Advisory Centers</p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side: Contact Form UI */}
        <section className="flex-grow bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span>✉️</span> Send a Message
          </h2>

          {submitted && (
            <div className="mb-6 p-4 bg-emerald-55 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-sm leading-relaxed animate-fadeIn">
              <strong>🎉 Message Received!</strong> Thank you for your feedback. We will get back to you shortly. (Week 2 Frontend Form Demo)
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Farmer/User Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white text-sm transition-colors text-slate-700 font-medium"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white text-sm transition-colors text-slate-700 font-medium"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Message / Feedback
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Type your questions or suggestions here..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white text-sm transition-colors text-slate-700 font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center px-6 py-4 border border-transparent text-base font-bold rounded-xl text-white bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 shadow-sm hover:shadow transition-all duration-200"
            >
              Send Message
            </button>
          </form>
        </section>

      </main>

      <Footer />
    </div>
  );
}
