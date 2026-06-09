"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

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

  // Quick advice chips for easy selection
  const quickChips = [
    "🍎 Apple Scab Disease",
    "🌾 Finger Millet (Mandua) Care",
    "💧 Sloped field irrigation",
    "🍃 Traditional organic compost",
    "🐛 Whitefly control",
  ];

  // Handle mock message sending
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = {
      id: messages.length + 1,
      sender: "user",
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");

    // Simulate quick automated response for demo purposes
    setTimeout(() => {
      const botMsg = {
        id: messages.length + 2,
        sender: "bot",
        text: `Thank you for sharing. For "${inputText}", I am analyzing mountain crop conditions in Uttarakhand. (This is a mock response for Week 2 frontend demo).`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1000);
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
                className="text-left text-sm px-4 py-3 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200/60 rounded-xl transition duration-200 font-medium text-slate-700"
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
              Demo Mode
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
              className="flex-grow px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white text-sm transition-colors text-slate-700"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl shadow-sm hover:shadow transition duration-200 flex items-center justify-center"
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

      <Footer />
    </div>
  );
}
