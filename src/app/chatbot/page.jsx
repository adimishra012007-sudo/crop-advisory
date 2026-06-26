"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Toast, Loader } from "../../components/ui";
import { searchCrop } from "../../lib/api";

// Chatbot page showing the crop advisory conversation interface
export default function ChatbotPage() {
  // Mock conversation state
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Namaskar! Welcome to the AI Crop Advisory Chatbot for Uttarakhand Farmers. How can I assist you with your farming query today?",
      time: "10:30 AM",
    },
    {
      id: 2,
      sender: "user",
      text: "My apple crop in Uttarkashi is showing dark brown spots on leaves. What should I do?",
      time: "10:31 AM",
    },
    {
      id: 3,
      sender: "bot",
      text: "Based on your description, this looks like Apple Scab, a common fungal disease in high-humidity mountain zones. I recommend: \n1. Prune and destroy infected leaves to reduce spore spread.\n2. Ensure proper spacing between trees for airflow.\n3. If severe, apply an organic copper-based fungicide or consultation-approved sprays during the pink bud stage.",
      time: "10:31 AM",
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // Quick advice chips for easy selection
  const quickChips = [
    "🍎 Apple Scab Disease",
    "🌾 Finger Millet (Mandua) Care",
    "💧 Sloped field irrigation",
    "🍃 Traditional organic compost",
    "🐛 Whitefly control",
  ];

  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  // Handle message sending and query the backend
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const query = inputText.trim();
    const userMsg = {
      id: messages.length + 1,
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    try {
      // Extract crop name keywords or query from user prompt
      let cleanQuery = query.toLowerCase()
        .replace(/how to grow/g, "")
        .replace(/about/g, "")
        .replace(/information on/g, "")
        .replace(/care for/g, "")
        .replace(/care/g, "")
        .replace(/disease in/g, "")
        .replace(/disease/g, "")
        .replace(/spots/g, "")
        .replace(/leaves/g, "")
        .replace(/pest/g, "")
        .replace(/issues/g, "")
        .replace(/related to:/g, "")
        .replace(/apple scab/g, "apple") // search for apple when scab is asked
        .trim();
      
      // Keep only letters and spaces to search cleanly
      cleanQuery = cleanQuery.replace(/[^a-z\s]/g, "").trim();

      let botText = "";
      if (cleanQuery.length >= 2) {
        // Query crop search endpoint
        const results = await searchCrop(cleanQuery);
        if (results && results.length > 0) {
          const crop = results[0]; // Take the first match
          botText = `Based on your query, here is the information from our crop advisory registry for **${crop.cropName}**:\n\n🌱 **Soil Profile**: ${crop.soilType}\n📅 **Season**: ${crop.season}\n💧 **Water Requirement**: ${crop.waterRequirement}\n🧪 **Recommended Fertilizer**: ${crop.fertilizer}\n\n📝 **Details**: ${crop.description}`;
        }
      }

      if (!botText) {
        // General responses if no crops matched
        if (query.toLowerCase().includes("scab") || query.toLowerCase().includes("spots")) {
          botText = "Based on your description, this looks like a crop health issue. Common diseases in Uttarakhand (like Apple Scab or Potato Blight) thrive in humid weather.\n\nRecommended actions:\n1. Prune and destroy infected leaves/branches.\n2. Ensure proper spacing between crops to allow airflow.\n3. Apply organic copper-based sprays or bio-fungicides.\n\nTo view general crops and their soil/season guidelines, please visit the **Crops** registry page.";
        } else if (query.toLowerCase().includes("irrigation") || query.toLowerCase().includes("water")) {
          botText = "For sloped terraced fields in Uttarakhand mountains, we recommend:\n1. Constructing contours to retain soil moisture.\n2. Implementing drip irrigation for crops like Apples or Garlic to prevent runoff.\n3. Harvesting rain water in farm ponds (Chalkhals).";
        } else if (query.toLowerCase().includes("compost") || query.toLowerCase().includes("organic") || query.toLowerCase().includes("manure")) {
          botText = "For traditional organic farming in Uttarakhand hills, you can use:\n1. **Jivamrit**: Made of cow dung, cow urine, jaggery, chickpea flour, and forest soil.\n2. **Bijamrit**: Used for seed treatment before sowing.\n3. **Vermicompost** and sheep manure to replenish mountain soils with rich nitrogen.";
        } else {
          botText = `Thank you for sharing your query about "${query}". I searched our regional Uttarakhand registry but couldn't find a direct crop profile matching your query. \n\nHowever, for general mountain farming, please ensure proper drainage for terrace fields and use organic compost like Jivamrit. You can check all available crops in the new **Crops** registry page.`;
        }
      }

      const botMsg = {
        id: messages.length + 2,
        sender: "bot",
        text: botText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      triggerToast(err.message || "Failed to contact the advisory API server.", "error");
      
      // Append fallback error bot message
      const errorMsg = {
        id: messages.length + 2,
        sender: "bot",
        text: "Sorry, I am currently unable to retrieve records from the crop advisory server. Please ensure the backend is running at http://localhost:5000.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleChipClick = (chipText) => {
    setInputText(`How to resolve issues related to: ${chipText}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-6">
        {/* Sidebar with quick suggestions */}
        <aside className="w-full md:w-80 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex-shrink-0">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span>💡</span> Common Farming Queries
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Click on any suggestion chip below to copy it directly into the chat input.
          </p>
          <div className="flex flex-col gap-3">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleChipClick(chip)}
                className="text-left text-sm px-4 py-3 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200/60 rounded-xl transition duration-200 font-medium text-slate-700 cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
          
          <div className="mt-8 border-t border-slate-100 pt-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">District Advisories</h3>
            <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl">
              <p className="text-xs text-emerald-800 leading-relaxed">
                🌦️ <strong>Weather Alert:</strong> High rainfall expected in Pithoragarh and Chamoli districts. Maintain proper drainage systems in potato fields.
              </p>
            </div>
          </div>
        </aside>

        {/* Chat Interface Container */}
        <section className="flex-grow bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[600px] overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-green-700 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-xl border border-white/10">
                🤖
              </div>
              <div>
                <h3 className="font-bold text-md leading-tight">AI Crop Assistant</h3>
                <span className="text-xs text-emerald-100 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  Online • Uttarakhand Agro Expert
                </span>
              </div>
            </div>
            <span className="text-xs bg-white/25 px-2.5 py-1 rounded-full font-medium">
              Live Mode
            </span>
          </div>

          {/* Messages display area */}
          <div className="flex-grow p-6 overflow-y-auto space-y-6 bg-slate-50/30">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 shadow-sm text-sm whitespace-pre-line ${
                    msg.sender === "user"
                      ? "bg-emerald-600 text-white rounded-tr-none"
                      : "bg-white text-slate-800 border border-slate-100 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-1.5 px-2">
                  {msg.time}
                </span>
              </div>
            ))}
            
            {/* Loader indicator while searching backend */}
            {loading && (
              <div className="flex items-center space-x-2 text-slate-400 dark:text-slate-500 animate-pulse">
                <Loader size="sm" color="emerald" />
                <span className="text-xs font-semibold">AI Assistant is searching registry...</span>
              </div>
            )}
          </div>

          {/* Form / Input area */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-slate-100 bg-white flex items-center gap-3"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about crop disease, pests, organic manure..."
              className="flex-grow px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white text-sm transition-colors text-slate-700 font-medium"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl shadow-sm hover:shadow transition duration-200 flex items-center justify-center cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                />
              </svg>
            </button>
          </form>
        </section>
      </main>

      {/* Toast notifications */}
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

