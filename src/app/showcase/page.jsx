"use client";

import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Button, Input, Modal, Toast, Loader } from "../../components/ui";

export default function ShowcasePage() {
  // Input Component State
  const [cropName, setCropName] = useState("");
  const [cropError, setCropError] = useState("");

  // Modal Component State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Toast Component State
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // Loader state inside Button
  const [isSimulatingLoad, setIsSimulatingLoad] = useState(false);

  // Active Tab for Code Examples
  const [activeTab, setActiveTab] = useState("button");

  // Validate Input helper
  const handleCropChange = (e) => {
    const val = e.target.value;
    setCropName(val);
    if (val.trim() === "") {
      setCropError("Crop name is required to fetch recommendations.");
    } else if (val.length < 3) {
      setCropError("Crop name must be at least 3 characters long.");
    } else {
      setCropError("");
    }
  };

  // Trigger Toast Notification
  const triggerToast = (message, type) => {
    setToast({ show: true, message, type });
  };

  // Simulate server loading state
  const handleSimulateLoad = () => {
    setIsSimulatingLoad(true);
    triggerToast("Initiating Soil Analysis diagnostics...", "success");
    setTimeout(() => {
      setIsSimulatingLoad(false);
      triggerToast("Diagnostics report generated successfully!", "success");
    }, 2500);
  };

  // Code snippets mapping for display
  const codeSnippets = {
    button: `import { Button } from "@/components/ui";

// Variants: primary, secondary, outline
// Sizes: sm, md, lg
<Button variant="primary" size="md" onClick={handleClick}>
  Primary Action
</Button>

<Button variant="outline" size="sm" disabled>
  Disabled Outline
</Button>`,
    input: `import { Input } from "@/components/ui";

<Input
  label="Crop Variety"
  placeholder="e.g. Basmati Rice"
  value={cropName}
  onChange={handleChange}
  error={cropError}
/>`,
    modal: `import { Modal } from "@/components/ui";

<Modal 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)} 
  title="Soil Analysis Settings"
>
  <p>Customize your soil chemical parameters here.</p>
</Modal>`,
    toast: `import { Toast } from "@/components/ui";

// Displays message with auto-dismiss after 4 seconds
<Toast
  message="Report downloaded successfully!"
  type="success"
  onClose={() => setShowToast(false)}
/>`,
    loader: `import { Loader } from "@/components/ui";

// Size: sm, md, lg
// Color: emerald, white, slate
<Loader size="md" color="emerald" />`,
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Title Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1.5 rounded-full">
              Component Library Showcase
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 mt-4 mb-6 sm:text-5xl">
              AI Crop Advisory UI Kit
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Explore our collection of clean, responsive, and reusable components custom-tailored for agricultural applications, dashboard overlays, and chatbot layouts.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Interactive Playground Side */}
            <div className="lg:col-span-2 space-y-8">
              {/* Buttons Card */}
              <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-sm">🔘</span>
                  Buttons (Button.jsx)
                </h2>
                
                {/* Variant Previews */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Variants</h3>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="primary" onClick={() => triggerToast("Clicked Primary Button!", "success")}>
                        Primary Button
                      </Button>
                      <Button variant="secondary" onClick={() => triggerToast("Clicked Secondary Button!", "success")}>
                        Secondary Button
                      </Button>
                      <Button variant="outline" onClick={() => triggerToast("Clicked Outline Button!", "success")}>
                        Outline Button
                      </Button>
                    </div>
                  </div>

                  {/* Sizing Previews */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Sizes</h3>
                    <div className="flex flex-wrap items-center gap-3">
                      <Button size="sm">Small (sm)</Button>
                      <Button size="md">Medium (md)</Button>
                      <Button size="lg">Large (lg)</Button>
                    </div>
                  </div>

                  {/* Interactivity Previews */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Interactions & Loading States</h3>
                    <div className="flex flex-wrap gap-3 items-center">
                      <Button variant="primary" disabled onClick={() => {}}>
                        Disabled State
                      </Button>
                      <Button
                        variant="primary"
                        disabled={isSimulatingLoad}
                        onClick={handleSimulateLoad}
                        className="gap-2"
                      >
                        {isSimulatingLoad ? (
                          <>
                            <Loader size="sm" color="white" />
                            <span>Analyzing...</span>
                          </>
                        ) : (
                          "Trigger Long-Running Task"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Inputs Card */}
              <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-sm">✍️</span>
                  Input Fields (Input.jsx)
                </h2>
                <div className="space-y-6 max-w-md">
                  <div>
                    <Input
                      label="Crop Cultivar"
                      placeholder="e.g. Wheat, Basmati Rice, Maize"
                      value={cropName}
                      onChange={handleCropChange}
                      error={cropError}
                    />
                    <p className="text-xs text-slate-400 mt-2">
                      Type less than 3 characters or leave empty to trigger error messages.
                    </p>
                  </div>

                  <div>
                    <Input
                      label="Soil Moisture Level (Disabled Input Example)"
                      placeholder="Automatic sensor read..."
                      value="42.5 %"
                      disabled
                      onChange={() => {}}
                    />
                  </div>
                </div>
              </section>

              {/* Modal & Toast Card */}
              <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-sm">💬</span>
                  Modals & Toasts (Modal.jsx / Toast.jsx)
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Modal Demonstrations</h3>
                    <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                      Launch Advisory Modal
                    </Button>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Toast Dispatchers</h3>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="secondary"
                        className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-950/70"
                        onClick={() => triggerToast("Weekly crop health report updated successfully!", "success")}
                      >
                        Trigger Success Toast
                      </Button>
                      <Button
                        variant="secondary"
                        className="bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950/70"
                        onClick={() => triggerToast("Unable to fetch real-time weather analytics. Check node connection.", "error")}
                      >
                        Trigger Error Toast
                      </Button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Loader Card */}
              <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-sm">⏳</span>
                  Loading Spinners (Loader.jsx)
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-900">
                    <Loader size="sm" color="emerald" />
                    <span className="text-xs text-slate-400 mt-3">Small (sm)</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-900">
                    <Loader size="md" color="emerald" />
                    <span className="text-xs text-slate-400 mt-3">Medium (md)</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-900">
                    <Loader size="lg" color="emerald" />
                    <span className="text-xs text-slate-400 mt-3">Large (lg)</span>
                  </div>
                </div>
              </section>
            </div>

            {/* Code Documentation & Guide Side */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs sticky top-24">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <span className="p-1 bg-slate-100 dark:bg-slate-800 rounded-md">📖</span>
                  Developer Usage
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                  Select a component below to copy its standard implementation template.
                </p>

                {/* Vertical Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {Object.keys(codeSnippets).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`text-xs px-3 py-2 rounded-lg font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                        activeTab === tab
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Preformatted Code Section */}
                <div className="relative bg-slate-950 text-slate-200 p-4 rounded-xl overflow-x-auto text-[11px] font-mono border border-slate-800 max-h-[350px]">
                  <pre>{codeSnippets[activeTab]}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Dialog Instance */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          triggerToast("Modal closed.", "success");
        }}
        title="Weekly Crop Diagnostics Config"
      >
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            Configure automated scheduling parameters for drone-guided imaging scans and chemical sensor diagnostics alerts.
          </p>
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 p-4 rounded-xl flex items-start space-x-3">
            <span className="text-lg">💡</span>
            <div className="text-xs text-emerald-800 dark:text-emerald-300">
              <strong className="block font-bold mb-0.5">Note on Escape Key</strong>
              Press the <span className="font-semibold px-1 py-0.5 bg-emerald-100 dark:bg-emerald-900 rounded">Esc</span> key on your keyboard to instantly dismiss this viewport frame.
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={() => {
              setIsModalOpen(false);
              triggerToast("Diagnostics scheduler updated!", "success");
            }}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Toast Alert Instance */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        />
      )}
      <Footer />
    </>
  );
}
