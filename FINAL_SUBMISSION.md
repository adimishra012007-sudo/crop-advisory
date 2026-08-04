# Final Capstone Submission Package

---

## 📌 Project Overview

- **Project Name**: AI Crop Advisory System
- **Internship Program**: Advanced AI & Web Development Capstone Internship
- **Student Name**: `[Aditya Mishra]`
- **GitHub Repository**: `https://github.com/adimishra012007-sudo/crop-advisory`

---

## 🌐 Live Production Deployments

- **Live Frontend URL**: [https://crop-advisory-tau.vercel.app](https://crop-advisory-tau.vercel.app)
- **Live Backend API URL**: [https://crop-advisory-p0ng.onrender.com](https://crop-advisory-p0ng.onrender.com)
- **Health API Endpoint**: [https://crop-advisory-p0ng.onrender.com/api/health](https://crop-advisory-p0ng.onrender.com/api/health)

---

## 🎥 Demo Video

- **Demo Video**: `[Add YouTube Unlisted Link After Recording]`

---

## 📚 Included Project Documentation

1. [README.md](README.md) – Comprehensive system guide, features, tech stack, API docs, and setup instructions.
2. [PROJECT_REPORT.md](PROJECT_REPORT.md) – Full technical project report detailing architecture, database schema, and module design.
3. [PORTFOLIO_SUMMARY.md](PORTFOLIO_SUMMARY.md) – Executive portfolio summary covering problem solved, technical challenges, and key achievements.
4. [DEMO_SCRIPT.md](DEMO_SCRIPT.md) – Structured 5-minute video presentation speaking script.
5. [DEMO_CHECKLIST.md](DEMO_CHECKLIST.md) – Pre-recording walkthrough checklist.
6. [REPOSITORY_CHECKLIST.md](REPOSITORY_CHECKLIST.md) – Comprehensive repository audit checklist.
7. [SUBMISSION_CHECKLIST.md](SUBMISSION_CHECKLIST.md) – Internship deliverables verification checklist.
8. [walkthrough.md](walkthrough.md) – Technical system architecture and execution walkthrough.
9. [.env.example](.env.example) – Frontend environment variables template.
10. [backend/.env.example](backend/.env.example) – Backend environment variables template.

---

## 🛠️ Technologies Used

- **Frontend**: Next.js 16 (App Router with Turbopack), React 19, Tailwind CSS v4, Vanilla CSS tokens, Chart.js, `react-chartjs-2`, `react-markdown`, `remark-gfm`
- **Backend**: Node.js (v18+), Express.js REST API
- **Database**: PostgreSQL hosted on Supabase (`pg` connection pooler)
- **Authentication**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, Google OAuth 2.0 REST Flow
- **AI Engine**: Google Gemini 3.1 Flash LLM via `@google/generative-ai` SDK
- **Deployment**: Vercel (Frontend Edge CDN) & Render Web Services (Backend API)

---

## ✨ Features Implemented

1. **User Authentication & Google OAuth 2.0**: Secure email/password login and registration with JWT tokens, plus single-click Google OAuth single sign-on.
2. **Crop Registry (CRUD)**: Complete database management for hill crops (soil type, climate, water requirement, fertilizer) with live debounced search.
3. **AI Agro Advisory**: Direct integration with Google Gemini 3.1 Flash for instant localized advisory on crop diseases, pest management, step terrace irrigation, and organic farming inputs.
4. **Rich Markdown Formatting**: Headings, lists, tables, code blocks, and blockquotes with custom ReactMarkdown component renderers.
5. **Message Utilities**: Per-message **Copy AI Response** button, auto-scrolling, and automatic smart session title generation.
6. **ChatGPT-Style Sidebar**: Session switching, `+ New Chat` workflow, **Pinned Chats (📌)** with drag-and-drop reordering, **Favorite Stars (⭐)**, and inline title renaming.
7. **Session Import & Export**: One-click JSON export and schema-validated JSON import.
8. **Analytics Dashboard**: 8 statistic metrics cards and 3 dynamic Chart.js visualizations (`Doughnut`, `Bar`, `Line`).
9. **Responsive & Accessible Design**: Dark and light mode toggle, accessible form field label bindings, keyboard Escape key modal dismissal, and mobile navigation drawer.

---

## 📚 Learning Outcomes

- Building and deploying a decoupled full-stack architecture with Next.js 16 App Router and Express Node.js.
- Securely proxying AI LLM prompts through an Express API layer without exposing API credentials.
- Managing database connections using Supabase PostgreSQL transaction pooling on port `6543`.
- Crafting responsive, accessible, and theme-consistent user interfaces with dark mode support.
- Documenting end-to-end technical projects for portfolio showcase and production deployment.

---

## 📋 Final Submission Checklist

- [x] Complete, clean source code repository verified with zero build errors.
- [x] Live production frontend deployed on Vercel (`https://crop-advisory-tau.vercel.app`).
- [x] Live production backend API deployed on Render (`https://crop-advisory-p0ng.onrender.com`).
- [x] Health check endpoint operational (`https://crop-advisory-p0ng.onrender.com/api/health`).
- [x] All 10 documentation files completed, verified, and cross-referenced.
- [x] All environment variable templates (`.env.example`) populated.
- [x] Codebase audited with zero hardcoded localhost URLs and zero exposed secrets.
