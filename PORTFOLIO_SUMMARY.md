# AI Crop Advisory System – Executive Portfolio Summary

**Project Title**: AI-Powered Crop Advisory System for Uttarakhand Farmers  
**Live Frontend**: [https://crop-advisory-tau.vercel.app](https://crop-advisory-tau.vercel.app)  
**Live Backend API**: [https://crop-advisory-p0ng.onrender.com](https://crop-advisory-p0ng.onrender.com)  
**API Health Check**: [https://crop-advisory-p0ng.onrender.com/api/health](https://crop-advisory-p0ng.onrender.com/api/health)  

---

## 📌 Project Overview

The **AI Crop Advisory System** is a full-stack smart agriculture platform built to provide instant, region-specific, and crop-specific advisory services to farmers in the hilly regions of Uttarakhand. By leveraging AI (Google Gemini 3.1 Flash LLM), PostgreSQL relational data persistence, and modern Next.js 16 user experience design, the platform offers real-time guidance on crop disease management, pest control, terrace irrigation, organic fertilizers (Jivamrit/Bijamrit), and crop selection tailored for step-terrace hill farming.

---

## 🎯 Problem Solved

Agriculture in Uttarakhand involves distinct terrain challenges—steep sloped fields, altitude variations, acidic soil composition, and unpredictable weather patterns. Traditional agricultural advice designed for plains often fails in mountain ecosystems, and access to local extension officers is frequently limited. 

This platform bridges the agricultural information gap by:
1. Providing 24/7 instant AI agro-advisory tailored specifically to hill terrace crops (Mandua finger millet, amaranth, apples, pulses).
2. Maintaining a searchable digital **Crop Registry** for soil, climate, and fertilizer recommendations.
3. Enabling persistent conversation histories with search, pin, favorite, and JSON import/export features.
4. Offering an **Analytics Dashboard** to track farming queries and interaction trends over time.

---

## 🌟 Key Features

- **Authentication & OAuth 2.0**: Secure registration, JWT login session management, and Google OAuth 2.0 single sign-on integration.
- **Crop Registry (CRUD)**: Complete CRUD database operations for hill crops with real-time debounced search by crop name.
- **AI Agro Assistant**: Integration with Google Gemini LLM returning structured Markdown responses (lists, tables, code blocks, blockquotes).
- **Message Utility Tools**: Per-message **Copy AI Response** clipboard tool, auto-scrolling, and automatic session title generation.
- **ChatGPT-Style Sidebar**: Session switching, `+ New Chat` workflow, **Pinned Chats (📌)** with drag-and-drop reordering, **Favorite Stars (⭐)**, and inline title editing.
- **Session Export & Import**: One-click JSON conversation export and strict schema-validated JSON import.
- **Analytics Dashboard**: 8 statistic metrics cards and 3 dynamic Chart.js visualizations (`Doughnut`, `Bar`, `Line`).
- **Accessible & Responsive Design**: Complete light/dark theme toggle, accessible form field bindings, keyboard Escape modal closing, and mobile navigation drawer.

---

## 🛠️ Technical Stack

- **Frontend Framework**: Next.js 16 (App Router with Turbopack) & React 19
- **Styling & UI**: Tailwind CSS v4, Vanilla CSS tokens, Glassmorphism
- **Data Visualization**: Chart.js & `react-chartjs-2`
- **Markdown Rendering**: `react-markdown` & `remark-gfm`
- **Backend Framework**: Node.js (v18+) & Express.js REST API
- **Database**: PostgreSQL hosted on Supabase (`pg` connection pooler)
- **AI Integration**: Google Generative AI SDK (`@google/generative-ai`)
- **Authentication**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, Google OAuth 2.0
- **Cloud Hosting**: Vercel (Frontend Edge CDN) & Render (Backend Web Service)

---

## 🏗️ System Architecture

```text
┌────────────────────────────────────────────────────────┐
│               Client Layer (Vercel)                    │
│   Next.js 16 App Router | React 19 | Tailwind CSS      │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTPS / REST API / JWT
                           ▼
┌────────────────────────────────────────────────────────┐
│               Server Layer (Render)                    │
│      Express.js REST API | Middleware Validation       │
└──────────────┬──────────────────────────┬──────────────┘
               │                          │
               ▼                          ▼
┌──────────────────────────────┐ ┌──────────────────────┐
│  AI Engine (Google Gemini)   │ │ Database (Supabase)  │
│ Gemini 3.1 Flash REST SDK    │ │ PostgreSQL | JSONB   │
└──────────────────────────────┘ └──────────────────────┘
```

---

## 💡 Key Technical Challenges & Solutions

1. **Decoupled Cross-Origin Authentication**:
   - *Challenge*: Synchronizing JWT sessions across Next.js frontend on Vercel and Express backend on Render without CORS issues.
   - *Solution*: Configured strict CORS origin parameters, Bearer token authorization headers, and a central `auth-change` event listener on `window` for instant UI state synchronization.

2. **Supabase PostgreSQL Connection Pooling**:
   - *Challenge*: Preventing connection exhaustion in serverless/cloud Node.js instances.
   - *Solution*: Utilized Supabase Transaction Connection Pooler on port `6543` with a shared `pg.Pool` instance and dynamic SSL configuration.

3. **Client-Side Hydration & Dark Mode SSR Safety**:
   - *Challenge*: Hydration mismatch warnings when reading `localStorage` theme state during server rendering.
   - *Solution*: Implemented inline head script execution in `layout.jsx` and skeleton placeholder loading in `ThemeToggle.jsx`.

---

## 📚 Learning Outcomes

- Designing and building production-grade decoupled full-stack architecture with Next.js App Router and Express APIs.
- Proxying AI LLM prompts securely through backend API servers to protect API credentials.
- Implementing advanced state management for drag-and-drop reordering, inline editing, and JSON import/export workflows.
- Deploying microservices with automated production pipelines on Vercel and Render.

---

## 🚀 Deployment Overview

- **Frontend**: Live on Vercel (`https://crop-advisory-tau.vercel.app`) with automatic continuous deployment from GitHub main branch.
- **Backend**: Live on Render (`https://crop-advisory-p0ng.onrender.com`) running Node.js production server connected to Supabase PostgreSQL database.

---

## 🔮 Future Scope

- **Dialect & Voice Support**: Hindi voice recognition and Garhwali/Kumaoni regional audio advisory synthesis.
- **Computer Vision Leaf Diagnosis**: Upload crop leaf photographs for automated AI disease detection.
- **Government Mandi API Integration**: Real-time crop market price tickers for Uttarakhand mandis.
