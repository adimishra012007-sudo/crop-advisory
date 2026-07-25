"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Toast, Loader } from "../../components/ui";
import {
  askAIChat,
  saveChat,
  getChatHistory,
  getConversation,
  deleteConversation,
  renameConversation,
  togglePinConversation,
  toggleFavoriteConversation,
  exportConversation,
  importConversation
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

// Custom Markdown Component Renderers for AI Messages
const markdownComponents = {
  h1: ({ node, ...props }) => <h1 className="text-lg font-bold text-slate-900 mt-3 mb-1.5 border-b border-slate-200 pb-1" {...props} />,
  h2: ({ node, ...props }) => <h2 className="text-base font-bold text-emerald-800 mt-3 mb-1.5" {...props} />,
  h3: ({ node, ...props }) => <h3 className="text-sm font-bold text-slate-800 mt-2 mb-1" {...props} />,
  p: ({ node, ...props }) => <p className="mb-2 leading-relaxed text-slate-700 font-normal last:mb-0" {...props} />,
  ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2 space-y-1 text-slate-700" {...props} />,
  ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-2 space-y-1 text-slate-700" {...props} />,
  li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
  strong: ({ node, ...props }) => <strong className="font-semibold text-slate-900" {...props} />,
  em: ({ node, ...props }) => <em className="italic text-slate-800" {...props} />,
  blockquote: ({ node, ...props }) => (
    <blockquote className="border-l-4 border-emerald-500 pl-3 py-1 my-2 bg-emerald-50/50 rounded-r-lg text-slate-700 italic text-xs" {...props} />
  ),
  table: ({ node, ...props }) => (
    <div className="overflow-x-auto my-3 rounded-xl border border-slate-200 shadow-xs">
      <table className="w-full text-left text-xs border-collapse bg-white" {...props} />
    </div>
  ),
  thead: ({ node, ...props }) => <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200" {...props} />,
  tr: ({ node, ...props }) => <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60" {...props} />,
  th: ({ node, ...props }) => <th className="p-2.5 font-semibold text-slate-800 border-r border-slate-200 last:border-r-0" {...props} />,
  td: ({ node, ...props }) => <td className="p-2.5 text-slate-700 border-r border-slate-100 last:border-r-0" {...props} />,
  a: ({ node, ...props }) => (
    <a className="text-emerald-600 hover:text-emerald-700 font-medium underline transition" target="_blank" rel="noopener noreferrer" {...props} />
  ),
  hr: ({ node, ...props }) => <hr className="my-3 border-slate-200" {...props} />,
  code: ({ node, inline, className, children, ...props }) => {
    if (inline) {
      return (
        <code className="bg-slate-100 text-emerald-800 font-mono text-[12px] px-1.5 py-0.5 rounded border border-slate-200" {...props}>
          {children}
        </code>
      );
    }
    return (
      <div className="my-3 rounded-xl overflow-hidden border border-slate-800 bg-slate-900 text-slate-100 shadow-md">
        <div className="bg-slate-800/80 px-3 py-1 text-[10px] text-slate-400 font-mono flex items-center justify-between border-b border-slate-700/60">
          <span>Code Snippet</span>
        </div>
        <pre className="p-3.5 overflow-x-auto text-xs font-mono leading-relaxed font-normal">
          <code {...props}>{children}</code>
        </pre>
      </div>
    );
  },
};

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

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // Sidebar mobile responsive drawer toggle state
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Inline editing state for conversation titles
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  // Drag and drop state for pinned chats
  const [draggedPinId, setDraggedPinId] = useState(null);

  // Ref for auto-scrolling to latest message
  const messagesEndRef = useRef(null);

  // Ref for file input element for Import
  const fileInputRef = useRef(null);

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

  // Auto-scroll to bottom whenever messages or loading state change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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

  // Copy AI response to clipboard
  const handleCopyMessage = (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
    triggerToast("Copied!", "success");
  };

  // Export conversation as JSON file (⬇ Export)
  const handleExportChat = async (e, chatItem) => {
    e.stopPropagation();
    try {
      const data = await exportConversation(chatItem.id);
      const dateStr = new Date().toISOString().split("T")[0];
      const filename = `conversation-${dateStr}.json`;
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      triggerToast("Conversation exported successfully!", "success");
    } catch (err) {
      console.error(err);
      triggerToast("Failed to export conversation.", "error");
    }
  };

  // Trigger import file dialog (⬆ Import)
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  // Handle JSON file upload and import
  const handleFileImportChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result;
        if (!content || typeof content !== "string") {
          triggerToast("Invalid conversation file.", "error");
          return;
        }

        let parsed;
        try {
          parsed = JSON.parse(content);
        } catch (parseErr) {
          triggerToast("Invalid conversation file.", "error");
          return;
        }

        // Validate required JSON fields
        if (
          !parsed ||
          typeof parsed !== "object" ||
          !parsed.title ||
          typeof parsed.title !== "string" ||
          !Array.isArray(parsed.messages) ||
          parsed.messages.length === 0
        ) {
          triggerToast("Invalid conversation file.", "error");
          return;
        }

        const res = await importConversation(parsed);
        triggerToast("Conversation imported successfully!", "success");
        await fetchHistory();

        // Open newly imported conversation
        const importedItem = res.conversation || res;
        if (importedItem && importedItem.id) {
          handleSelectChat(importedItem);
        }
      } catch (err) {
        console.error(err);
        triggerToast("Invalid conversation file.", "error");
      }
    };
    reader.readAsText(file);
  };

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

  // Action: Toggle Pin (📌)
  const handleTogglePin = async (e, chatItem) => {
    e.stopPropagation();
    const newStatus = !(chatItem.is_pinned || chatItem.isPinned);
    try {
      await togglePinConversation(chatItem.id, newStatus);
      triggerToast(newStatus ? "Conversation pinned 📌" : "Conversation unpinned", "success");
      fetchHistory();
    } catch (err) {
      console.error(err);
      triggerToast(err.message || "Failed to update pin state.", "error");
    }
  };

  // Action: Toggle Favorite (⭐)
  const handleToggleFavorite = async (e, chatItem) => {
    e.stopPropagation();
    const newStatus = !(chatItem.is_favorite || chatItem.isFavorite);
    try {
      await toggleFavoriteConversation(chatItem.id, newStatus);
      triggerToast(newStatus ? "Marked as favorite ⭐" : "Removed from favorites", "success");
      fetchHistory();
    } catch (err) {
      console.error(err);
      triggerToast(err.message || "Failed to update favorite state.", "error");
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

  // Drag and Drop handlers for Pinned chats
  const handleDragStart = (e, chatItem) => {
    e.dataTransfer.setData("text/plain", chatItem.id);
    setDraggedPinId(chatItem.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetChatItem) => {
    e.preventDefault();
    if (!draggedPinId || String(draggedPinId) === String(targetChatItem.id)) return;

    setHistoryList((prevList) => {
      const listCopy = [...prevList];
      const draggedIdx = listCopy.findIndex((item) => String(item.id) === String(draggedPinId));
      const targetIdx = listCopy.findIndex((item) => String(item.id) === String(targetChatItem.id));
      if (draggedIdx === -1 || targetIdx === -1) return prevList;
      const [draggedItem] = listCopy.splice(draggedIdx, 1);
      listCopy.splice(targetIdx, 0, draggedItem);
      return listCopy;
    });
    setDraggedPinId(null);
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
          chatTitle = generateAutoTitle(query);
        } else {
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

  // Filter conversations by Search Query (Title or Message content)
  const filteredHistory = historyList.filter((chat) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const titleMatch = (chat.title || "").toLowerCase().includes(q);
    const messageMatch = Array.isArray(chat.messages)
      ? chat.messages.some((m) => (m.content || m.text || "").toLowerCase().includes(q))
      : false;
    return titleMatch || messageMatch;
  });

  // Group filtered history into Pinned, Favorites, and Recent
  const pinnedChats = filteredHistory.filter((c) => c.is_pinned || c.isPinned);
  const favoriteChats = filteredHistory.filter((c) => (c.is_favorite || c.isFavorite) && !(c.is_pinned || c.isPinned));
  const regularChats = filteredHistory.filter((c) => !(c.is_pinned || c.isPinned) && !(c.is_favorite || c.isFavorite));

  // Render a single conversation item card
  const renderChatItem = (chat) => {
    const isActive = conversationId === chat.id;
    const isEditing = editingId === chat.id;
    const isPinned = chat.is_pinned || chat.isPinned;
    const isFavorite = chat.is_favorite || chat.isFavorite;

    return (
      <div
        key={chat.id}
        draggable={isPinned}
        onDragStart={(e) => isPinned && handleDragStart(e, chat)}
        onDragOver={(e) => isPinned && handleDragOver(e)}
        onDrop={(e) => isPinned && handleDrop(e, chat)}
        onClick={() => handleSelectChat(chat)}
        className={`group relative flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-sm transition duration-150 border ${
          isActive
            ? "bg-emerald-50 text-emerald-900 border-emerald-200 font-semibold"
            : "hover:bg-slate-50 text-slate-700 border-transparent hover:border-slate-200"
        }`}
      >
        <div className="flex items-center gap-2 overflow-hidden w-full pr-24">
          <span className="text-sm flex-shrink-0">
            {isPinned ? "📌" : isFavorite ? "⭐" : "💬"}
          </span>
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

        {/* Action Controls Menu (Export, Pin, Favorite, Rename, Delete) */}
        {!isEditing && (
          <div className="absolute right-1 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 dark:bg-slate-800/95 p-1 rounded-lg shadow-xs">
            {/* Export Button */}
            <button
              onClick={(e) => handleExportChat(e, chat)}
              title="⬇ Export Conversation"
              className="p-1 text-slate-400 hover:text-emerald-600 transition text-xs"
            >
              ⬇
            </button>
            {/* Pin Button */}
            <button
              onClick={(e) => handleTogglePin(e, chat)}
              title={isPinned ? "Unpin Chat" : "Pin Chat"}
              className={`p-1 transition text-xs ${isPinned ? "text-amber-600" : "text-slate-400 hover:text-amber-500"}`}
            >
              📌
            </button>
            {/* Favorite Button */}
            <button
              onClick={(e) => handleToggleFavorite(e, chat)}
              title={isFavorite ? "Remove Favorite" : "Favorite Chat"}
              className={`p-1 transition text-xs ${isFavorite ? "text-yellow-500" : "text-slate-400 hover:text-yellow-500"}`}
            >
              ⭐
            </button>
            {/* Rename Button */}
            <button
              onClick={(e) => handleStartRename(e, chat)}
              title="Rename Conversation"
              className="p-1 text-slate-400 hover:text-emerald-600 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
              </svg>
            </button>
            {/* Delete Button */}
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
  };

  // Render Sidebar Content (Reused for desktop left panel and mobile drawer)
  const renderSidebarContent = () => (
    <div className="flex flex-col h-full bg-white p-4">
      {/* Hidden File Input for Importing JSON */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".json"
        onChange={handleFileImportChange}
        style={{ display: "none" }}
      />

      {/* Top Action Buttons (+ New Chat & ⬆ Import) */}
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={handleNewChat}
          className="flex-grow flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-3 rounded-xl shadow-sm transition duration-200 cursor-pointer text-xs"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          + New Chat
        </button>

        <button
          onClick={handleImportClick}
          title="⬆ Import Conversation JSON"
          className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 px-3 rounded-xl border border-slate-200 transition duration-200 cursor-pointer text-xs"
        >
          <span>⬆</span> Import
        </button>
      </div>

      {/* Instant Search Input Box */}
      <div className="relative mb-3 flex-shrink-0">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs">
          🔍
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search conversations..."
          className="w-full pl-8 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 focus:bg-white transition text-slate-700 font-medium"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between px-1 mb-2">
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Conversations</h3>
        {loadingHistory && <Loader size="sm" color="emerald" />}
      </div>

      {/* Conversation List Container */}
      <div className="flex-grow overflow-y-auto space-y-3 pr-1">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            {searchQuery ? "No conversations found" : "No saved conversations yet. Start a new chat!"}
          </div>
        ) : (
          <>
            {/* Pinned Conversations */}
            {pinnedChats.length > 0 && (
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider px-1 mb-1 flex items-center gap-1">
                  <span>📌</span> Pinned
                </div>
                {pinnedChats.map((chat) => renderChatItem(chat))}
              </div>
            )}

            {/* Favorite Conversations */}
            {favoriteChats.length > 0 && (
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-yellow-600 uppercase tracking-wider px-1 mb-1 flex items-center gap-1">
                  <span>⭐</span> Favorites
                </div>
                {favoriteChats.map((chat) => renderChatItem(chat))}
              </div>
            )}

            {/* Regular Conversations */}
            {regularChats.length > 0 && (
              <div className="space-y-1">
                {(pinnedChats.length > 0 || favoriteChats.length > 0) && (
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 mb-1">
                    Recent
                  </div>
                )}
                {regularChats.map((chat) => renderChatItem(chat))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Quick Suggestions Footer */}
      <div className="mt-4 border-t border-slate-100 pt-3 flex-shrink-0">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Quick Suggestions</h3>
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
                className="md:hidden p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition cursor-pointer"
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

          {/* Quick Advice Chips Header inside Chat panel */}
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
                <div className="relative group max-w-[85%] sm:max-w-[80%]">
                  <div
                    className={`rounded-2xl p-4 shadow-sm text-sm ${
                      msg.sender === "user"
                        ? "bg-emerald-600 text-white rounded-tr-none whitespace-pre-line"
                        : "bg-white text-slate-800 border border-slate-100 rounded-tl-none pr-10"
                    }`}
                  >
                    {msg.sender === "user" ? (
                      msg.text
                    ) : (
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                        {msg.text}
                      </ReactMarkdown>
                    )}
                  </div>

                  {/* Copy Response Button for AI Messages */}
                  {msg.sender === "bot" && (
                    <button
                      onClick={() => handleCopyMessage(msg.text)}
                      title="Copy AI Response"
                      className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all opacity-80 hover:opacity-100 cursor-pointer flex items-center gap-1 text-[11px] font-medium"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v9.25c0 .621-.504 1.125-1.125 1.125Z" />
                      </svg>
                      <span>Copy</span>
                    </button>
                  )}
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

            {/* Ref anchor for auto-scroll */}
            <div ref={messagesEndRef} />
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
