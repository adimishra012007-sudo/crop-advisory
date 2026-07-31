# Comprehensive Project Report: AI-Powered Crop Advisory System

**Project Title**: AI-Powered Crop Advisory System for Uttarakhand Mountain Agriculture  
**Project TBI ID**: 26100438  
**Deployment URLs**:
- **Frontend**: [https://crop-advisory-tau.vercel.app](https://crop-advisory-tau.vercel.app)
- **Backend API**: [https://crop-advisory-p0ng.onrender.com](https://crop-advisory-p0ng.onrender.com)
- **GitHub Repository**: [https://github.com/adimishra012007-sudo/crop-advisory](https://github.com/adimishra012007-sudo/crop-advisory)

---

## 1. Project Objective

The primary objective of the AI Crop Advisory System is to provide localized, intelligent, real-time agricultural guidance to hill farmers and agro-entrepreneurs in Uttarakhand. Mountain agriculture presents distinct challenges—including sloped terrain, rainfed terrace farming, distinct microclimates, and regional crop species like Mandua (finger millet), Jhangora (barnyard millet), Gahat (horse gram), and Munsiyari Rajma. 

This platform bridges the agricultural information gap by delivering an interactive, AI-driven advisory interface powered by Google Gemini AI, backed by a persistent PostgreSQL crop registry and conversation history system.

---

## 2. Problem Statement

Farmers in high-altitude and terrace regions of Uttarakhand face multiple operational hurdles:
- **Lack of Localized Advice**: Conventional advisory apps cater to large plains agriculture and fail to consider hill soil acidity, sloped terrace irrigation, or hill-specific pest control.
- **Fragmented Access to Crop Data**: Information regarding suitable sowing seasons (Kharif, Rabi, Zaid), organic manure recommendations (Jivamrit, Bijamrit), and water requirements is scattered across disconnected government portals.
- **Absence of Conversation History**: Farmers often lose past advice or diagnosis recommendations without persistent session history and export/import tools.

---

## 3. Architecture Overview

The system is built on a decoupled, full-stack architecture designed for high availability and scalability:

```text
┌────────────────────────────────────────────────────────┐
│                   Next.js 16 Client                    │
│             (Deployed on Vercel Edge Host)             │
└───────────────────────────┬────────────────────────────┘
                            │  HTTPS REST / JWT Bearer
                            ▼
┌────────────────────────────────────────────────────────┐
│                  Express.js API Server                 │
│              (Deployed on Render Web App)              │
└───────────────┬────────────────────────┬───────────────┘
                │                        │
                ▼                        ▼
┌───────────────────────────┐  ┌─────────────────────────┐
│ Supabase PostgreSQL DB    │  │ Google Gemini 3.1 Flash │
│ (pg Connection Pooler)    │  │ Generative AI API       │
└───────────────────────────┘  └─────────────────────────┘
```

- **Frontend Tier**: Built with Next.js 16 (App Router with Turbopack), React 19, and Tailwind CSS.
- **Backend API Tier**: Express.js REST API service with trust-proxy headers, rate limiting, and centralized error handling middleware.
- **Database Tier**: Hosted Supabase PostgreSQL instance using connection pooler (Port 6543) for high concurrency.
- **AI Engine**: Google Gemini 3.1 Flash Generative AI SDK (`@google/generative-ai`) customized with localized agricultural system prompts.

---

## 4. System Modules

### 4.1. Authentication & User Management
- JWT (JSON Web Token) authentication flow for secure state persistence across browser reloads.
- Password security enforced via `bcryptjs` salted hashing.
- Google OAuth 2.0 single sign-on integration allowing instant account creation and authorization.

### 4.2. Crop Registry Management (CRUD)
- Full REST endpoints (`/api/crops`) for creating, reading, updating, searching, and deleting crop records.
- Real-time search and filter controls for soil types, seasons, and region specifics.

### 4.3. ChatGPT-Style AI Advisory Chatbot
- Interactive messaging interface with streaming markdown rendering (`react-markdown`, `remark-gfm`).
- Automated response copy button with clipboard feedback.
- System prompt enforcing strict agricultural bounds (refuses non-farming queries politely).

### 4.4. Conversation History & Persistence
- Session persistence stored in PostgreSQL `chat_history` table (`JSONB` message arrays).
- Sidebar session manager with `+ New Chat`, inline title editing, pin (📌) support, and favorite (⭐) grouping.
- JSON Import and Export capabilities.

### 4.5. Analytics & Dashboard
- Aggregated user conversation metrics (total chats, message count, pin count, favorite count, longest conversation).
- Dynamic Chart.js visualizations (`Doughnut`, `Bar`, `Line`).

---

## 5. Database Design

The PostgreSQL database uses three core tables:

1. **`users`**:
   - `id` (SERIAL, PK), `name` (VARCHAR), `email` (VARCHAR, UNIQUE), `password` (VARCHAR), `role` (VARCHAR), `location` (JSONB), `phone` (VARCHAR), `created_at`/`updated_at`.
2. **`crops`**:
   - `id` (SERIAL, PK), `crop_name` (VARCHAR), `soil_type` (VARCHAR), `season` (VARCHAR), `water_requirement` (VARCHAR), `fertilizer` (VARCHAR), `description` (TEXT), `created_at`/`updated_at`.
3. **`chat_history`**:
   - `id` (SERIAL, PK), `user_id` (FK -> users.id), `title` (VARCHAR), `session_name` (VARCHAR), `messages` (JSONB), `is_pinned` (BOOLEAN), `is_favorite` (BOOLEAN), `created_at`/`updated_at`.

---

## 6. Challenges Faced & Solutions Implemented

| Challenge | Root Cause | Solution Implemented |
|---|---|---|
| **Google OAuth `redirect_uri_mismatch`** | Render reverse proxy stripped `https` scheme, causing Express to construct `http` callback URIs. | Added `app.set("trust proxy", 1)` in `server.js` and created dynamic `getGoogleCallbackUrl()` resolution helper. |
| **Connection Pooling Exhaustion** | Direct PostgreSQL port 5432 hit ISP and connection limits during high concurrency. | Switched Supabase database connection string to transaction pooler port `6543`. |
| **Heavy Bundle Load on Mobile** | Importing Chart.js synchronously bloated main thread JavaScript bundle. | Utilized Next.js `dynamic()` imports with `ssr: false` for canvas charts. |
| **Credential Exposure in Server Logs** | DB connection failure strings printed raw connection URIs with passwords. | Added regex sanitizer function `sanitizeErrorMessage()` to mask DB connection URIs before logging. |

---

## 7. Learning Outcomes & Achievements

- Developed deep expertise in full-stack Next.js (App Router) and Express.js REST API development.
- Mastered OAuth 2.0 integration, JWT state management, and CORS cross-origin security.
- Implemented robust database migrations, JSONB semi-structured queries, and connection pooling in PostgreSQL.
- Architected prompt engineering strategies using Google Gemini Generative AI SDK for specialized domain advisory.
- Successfully deployed, configured, and verified production builds on Vercel and Render.
