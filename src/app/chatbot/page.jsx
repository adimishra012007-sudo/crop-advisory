"use client";

import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Toast, Loader } from "../../components/ui";
import {
  askAIChat,
  saveChat,
  getChatHistory,
  getConversation,
  deleteConversation,
  renameConversation
} from "../../lib/api";
import { getToken } from "../../lib/auth";

// Helper function to format relative timestamps
function formatRelativeDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

// Helper to auto-generate a concise title from the user's first question
function generateAutoTitle(firstQuestion) {
  if (!firstQuestion) return "Conversation";
  let cleaned = firstQuestion.trim();
  // Strip common introductory prefixes
  cleaned = cleaned
    .replace(/^(how to resolve issues related to:?|how to|what is|what are|can you|tell me about|how do i)\s*/i, "")
    .trim();
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  cleaned = cleaned.replace(/[?.!]+$/, "");
  if (cleaned.length > 30) {
    cleaned = cleaned.substring(0, 30).trim() + "...";
  }
  return cleaned || "Conversation";
}

const DEFAULT_INITIAL_MESSAGES = [
  {
    id: 1,
    sender: "bot",
    text: "Namaskar! Welcome to the AI Crop Advisory Chatbot for Uttarakhand Farmers. How can I assist you with your farming query today?",
    time: "10:30 AM",
  },
];

export default function ChatbotPage() {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState(DEFAULT_INITIAL_MESSAGES);
  const [historyList, setHistoryList] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // Sidebar mobile responsive drawer toggle state
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Inline editing state for conversation titles
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

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

  // Fetch chat history from backend on initial mount
  const fetchHistory = async () => {
    if (!getToken()) return;
    try {
      setLoadingHistory(true);
      const res = await getChatHistory();
      if (Array.isArray(res)) {
        setHistoryList(res);
      } else if (res && res.conversations) {
        setHistoryList(res.conversations);
      }
    } catch (err) {
      console.warn("Failed to load chat history:", err.message);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Action: Start New Chat
  const handleNewChat = () => {
    setConversationId(null);
    setMessages(DEFAULT_INITIAL_MESSAGES);
    setMobileSidebarOpen(false);
  };

  // Action: Select existing chat from history list
  const handleSelectChat = async (chatItem) => {
    setMobileSidebarOpen(false);
    try {
      setLoading(true);
      const detail = await getConversation(chatItem.id);
      if (detail && detail.messages) {
        setConversationId(detail.id);
        const mappedMsgs = (detail.messages || []).map((m, idx) => ({
          id: idx + 1,
          sender: m.role === "user" ? "user" : "bot",
          text: m.content || m.text || "",
          time: detail.updated_at ? formatRelativeDate(detail.updated_at) : "Saved",
        }));
        setMessages(mappedMsgs.length > 0 ? mappedMsgs : DEFAULT_INITIAL_MESSAGES);
      }
    } catch (err) {
      console.error(err);
      triggerToast("Failed to load conversation details.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Action: Delete conversation
  const handleDeleteChat = async (e, chatItem) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete "${chatItem.title}"?`)) {
      return;
    }

    try {
      await deleteConversation(chatItem.id);
      triggerToast("Conversation deleted successfully.", "success");
      if (conversationId === chatItem.id) {
        handleNewChat();
      }
      fetchHistory();
    } catch (err) {
      console.error(err);
      triggerToast(err.message || "Failed to delete conversation.", "error");
    }
  };

  // Action: Inline Rename - Start Editing
  const handleStartRename = (e, chatItem) => {
    e.stopPropagation();
    setEditingId(chatItem.id);
    setEditingTitle(chatItem.title);
  };

  // Action: Inline Rename - Save
  const handleSaveRename = async (id) => {
    if (!editingTitle.trim()) {
      setEditingId(null);
      return;
    }

    try {
      await renameConversation(id, editingTitle.trim());
      triggerToast("Conversation renamed.", "success");
      setEditingId(null);
      fetchHistory();
    } catch (err) {
      console.error(err);
      triggerToast(err.message || "Failed to rename conversation.", "error");
    }
  };

  // Action: Inline Rename - Key Down Handler (Enter to save, Escape to cancel)
  const handleKeyDownRename = (e, id) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveRename(id);
    } else if (e.key === "Escape") {
      setEditingId(null);
    }
  };

  // Handle message sending and query the backend AI
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

    const updatedMessagesWithUser = [...messages, userMsg];
    setMessages(updatedMessagesWithUser);
    setInputText("");
    setLoading(true);

    try {
      // Query the backend AI chat endpoint
      const data = await askAIChat(query);
      const botText = data.response;

      const botMsg = {
        id: updatedMessagesWithUser.length + 1,
        sender: "bot",
        text: botText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const fullMessages = [...updatedMessagesWithUser, botMsg];
      setMessages(fullMessages);

      // Auto-save and Auto Title Generation
      try {
        let chatTitle;
        if (!conversationId) {
          // New conversation: Auto-generate title from the first user question
          chatTitle = generateAutoTitle(query);
        } else {
          // Find current chat item title or fallback
          const existingItem = historyList.find((h) => h.id === conversationId);
          if (existingItem && existingItem.title && existingItem.title !== "Conversation") {
            chatTitle = existingItem.title;
          } else {
            chatTitle = generateAutoTitle(query);
          }
        }

        const formattedMessages = fullMessages.map((m) => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.text,
        }));

        const saveRes = await saveChat({
          id: conversationId,
          title: chatTitle,
          messages: formattedMessages,
        });

        if (saveRes && (saveRes.id || (saveRes.conversation && saveRes.conversation.id))) {
          const savedId = saveRes.id || saveRes.conversation.id;
          setConversationId(savedId);
        }

        // Refresh conversation sidebar
        fetchHistory();
      } catch (autoSaveErr) {
        console.warn("Silent conversation auto-save failure:", autoSaveErr.message);
      }
    } catch (err) {
      console.error(err);
      triggerToast(err.message || "Failed to contact the advisory API server.", "error");

      const errorMsg = {
        id: updatedMessagesWithUser.length + 1,
        sender: "bot",
        text: "Sorry, I am currently unable to retrieve advice from the AI Crop Advisor. Please check your connection and ensure the backend is running.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...updatedMessagesWithUser, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleChipClick = (chipText) => {
    setInputText(`How to resolve issues related to: ${chipText}`);
  };

  // Render Sidebar Content (Reused for desktop left panel and mobile drawer)
  const renderSidebarContent = () => (
    <div className="flex flex-col h-full bg-white p-4">
      {/* New Chat Button */}
      <button
        onClick={handleNewChat}
        className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl shadow-sm transition duration-200 cursor-pointer mb-5"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        + New Chat
      </button>

      {/* Conversations Section Header */}
      <div className="flex items-center justify-between px-2 mb-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Chats</h3>
        {loadingHistory && <Loader size="sm" color="emerald" />}
      </div>

      {/* Conversation List */}
      <div className="flex-grow overflow-y-auto space-y-1.5 pr-1">
        {historyList.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No saved conversations yet. Start a new chat below!
          </div>
        ) : (
          historyList.map((chat) => {
            const isActive = conversationId === chat.id;
            const isEditing = editingId === chat.id;

            return (
              <div
                key={chat.id}
                onClick={() => handleSelectChat(chat)}
                className={`group relative flex items-center justify-between p-3 rounded-xl cursor-pointer text-sm transition duration-150 border ${
                  isActive
                    ? "bg-emerald-50 text-emerald-900 border-emerald-200 font-semibold"
                    : "hover:bg-slate-50 text-slate-700 border-transparent hover:border-slate-200"
                }`}
              >
                <div className="flex items-center gap-2.5 overflow-hidden w-full pr-16">
                  <span className="text-base flex-shrink-0">💬</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onKeyDown={(e) => handleKeyDownRename(e, chat.id)}
                      onBlur={() => handleSaveRename(chat.id)}
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs bg-white text-slate-800 border border-emerald-400 rounded px-2 py-1 w-full focus:outline-none"
                    />
                  ) : (
                    <div className="flex flex-col overflow-hidden">
                      <span className="truncate text-xs font-medium text-slate-800 group-hover:text-emerald-700">
                        {chat.title || "Conversation"}
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {formatRelativeDate(chat.updated_at || chat.created_at)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions (Rename & Delete) */}
                {!isEditing && (
                  <div className="absolute right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-slate-800/90 p-1 rounded-lg">
                    {/* Rename Icon */}
                    <button
                      onClick={(e) => handleStartRename(e, chat)}
                      title="Rename Conversation"
                      className="p-1 text-slate-400 hover:text-emerald-600 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                      </svg>
                    </button>
                    {/* Delete Icon */}
                    <button
                      onClick={(e) => handleDeleteChat(e, chat)}
                      title="Delete Conversation"
                      className="p-1 text-slate-400 hover:text-red-600 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Common Farming Queries Sidebar Footer */}
      <div className="mt-4 border-t border-slate-100 pt-4 flex-shrink-0">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Suggestions</h3>
        <div className="flex flex-wrap gap-1.5">
          {quickChips.slice(0, 3).map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleChipClick(chip)}
              className="text-[11px] px-2.5 py-1.5 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200/60 rounded-lg transition font-medium text-slate-700 cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-6">
        {/* Desktop ChatGPT-Style Left Sidebar */}
        <aside className="hidden md:block w-80 bg-white rounded-2xl shadow-sm border border-slate-100 flex-shrink-0 overflow-hidden h-[650px]">
          {renderSidebarContent()}
        </aside>

        {/* Mobile Sidebar Overlay Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
              onClick={() => setMobileSidebarOpen(false)}
            ></div>
            <div className="relative w-80 bg-white h-full shadow-2xl flex flex-col z-10">
              <div className="p-3 flex items-center justify-between border-b border-slate-100">
                <span className="text-sm font-bold text-slate-800">Chat History</span>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  ✕
                </button>
              </div>
              <div className="flex-grow overflow-hidden">
                {renderSidebarContent()}
              </div>
            </div>
          </div>
        )}

        {/* Main Chat Interface Container */}
        <section className="flex-grow bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[650px] overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-green-700 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile Sidebar Toggle Button */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="md:hidden p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition"
                title="Toggle Sidebar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>

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
            <div className="flex items-center gap-2">
              <button
                onClick={handleNewChat}
                className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-full font-medium transition flex items-center gap-1 cursor-pointer"
              >
                <span>+</span> New Chat
              </button>
            </div>
          </div>

          {/* Quick Advice Chips Header inside Chat panel for quick access */}
          <div className="bg-slate-50/70 border-b border-slate-100 px-4 py-2 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-slate-400 font-medium flex-shrink-0">Suggestions:</span>
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleChipClick(chip)}
                className="flex-shrink-0 text-[11px] px-3 py-1 bg-white hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200/70 rounded-full font-medium text-slate-600 transition cursor-pointer"
              >
                {chip}
              </button>
            ))}
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

            {/* Loader indicator while querying AI */}
            {loading && (
              <div className="flex items-center space-x-2 text-slate-400 dark:text-slate-500 animate-pulse">
                <Loader size="sm" color="emerald" />
                <span className="text-xs font-semibold">AI Assistant is thinking...</span>
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
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed text-white p-3 rounded-xl shadow-sm hover:shadow transition duration-200 flex items-center justify-center cursor-pointer"
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
