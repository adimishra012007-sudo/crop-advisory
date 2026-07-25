# AI-Powered Crop Advisory System for Uttarakhand Farmers

An AI-Powered Crop Advisory platform tailored for mountain agriculture and farmers in Uttarakhand. The application features a Next.js (App Router) frontend and an Express.js Node.js backend connected to a Supabase PostgreSQL database and the Google Gemini AI API.

**Project TBI ID**: 26100438

---

## 🌟 Key Features (Weeks 1–8)

1. **Authentication & Authorization**
   - JWT-based authentication for registration, login, and protected routes.
   - Google OAuth 2.0 single sign-on integration.

2. **Crop Registry Management (CRUD)**
   - Complete database management for crops (soil type, climate, water requirement, fertilizer recommendations).
   - Real-time search and filter controls.

3. **ChatGPT-Style AI Advisory Interface**
   - Direct integration with Google Gemini 3.1 Flash API (`@google/generative-ai`).
   - Rich Markdown rendering (`react-markdown`, `remark-gfm`) for structured AI advice, lists, tables, code blocks, and blockquotes.
   - **Per-Message Copy Response Button** with instant clipboard feedback.
   - **Auto-Scrolling** to latest AI responses.
   - **Auto Title Generation** based on the user's first query.

4. **Conversation Session Management & History Persistence**
   - Persistent PostgreSQL storage (`chat_history` JSONB column).
   - ChatGPT-style sidebar with session switching and `+ New Chat` button.
   - **Instant Search** by title and message content.
   - **Pinned Chats (📌)** with frontend HTML5 Drag & Drop reordering.
   - **Favorite Chats (⭐)** and grouped sidebar categories.
   - **Inline Title Editing** (Enter to save, Escape to cancel).
   - **Export (⬇)** conversations to formatted `.json` files.
   - **Import (⬆)** `.json` files with strict validation and auto-opening.

5. **Conversation Analytics Dashboard**
   - Aggregate statistics: Total Conversations, Total Messages, Favorites, Pinned Chats, Average Messages, Longest Chat, Oldest/Latest Activity Dates.
   - Interactive Chart.js visual charts (`Doughnut`, `Bar`, `Line`) dynamically imported for optimal bundle performance.

---

## 📁 Project Directory Structure

```text
crop-advisory/
│
├── backend/                  # Express REST API Server
│   ├── config/               # PostgreSQL pool connection & schema migration (db.js)
│   ├── controllers/          # Request handlers (userController, cropController, aiController, chatController)
│   ├── data/                 # Initial seed crop database (crops.js)
│   ├── middleware/           # Auth JWT protect, dbCheck, rateLimiter, validation, errorHandler
│   ├── models/               # Database ORM models (userModel, cropModel, chatHistoryModel)
│   ├── routes/               # Express API routes (userRoutes, cropRoutes, aiRoutes, chatRoutes)
│   ├── services/             # External service wrappers (geminiService.js)
│   ├── .env.example          # Environment variables template
│   ├── package.json          # Backend Node.js dependencies
│   └── server.js             # Express entry point
│
├── src/                      # Next.js 16 (App Router) Frontend
│   ├── app/                  # Application pages & layouts
│   │   ├── about/            # Project background page
│   │   ├── chatbot/          # AI Chatbot interface page
│   │   ├── contact/          # Support page
│   │   ├── crops/            # Crop management CRUD dashboard
│   │   ├── dashboard/        # Analytics & Farmer Dashboard
│   │   ├── login/            # Authentication login
│   │   ├── profile/          # User profile details
│   │   ├── signup/           # User registration
│   │   ├── layout.jsx        # Root HTML wrapper layout
│   │   └── page.jsx          # Landing page
│   │
│   ├── components/           # Reusable UI primitives & Header/Footer
│   │   ├── ui/               # Button, Input, Modal, Toast, Loader primitives
│   │   ├── Navbar.jsx        # Top navigation header
│   │   └── Footer.jsx        # Page footer
│   │
│   └── lib/                  # Utilities & API Service Client
│       ├── api.js            # Client-side API fetch client
│       └── auth.js           # Local authentication token state helper
│
├── package.json              # Frontend dependencies config
├── PROMPTS.md                # Prompt Engineering documentation
├── walkthrough.md            # System Architecture & Technical Walkthrough
└── README.md                 # Complete documentation guide
```

---

## 🚀 REST API Endpoint Specification

### 1. User & Auth Routes (`/api/users`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/users/signup` | Public | Register a new user |
| `POST` | `/api/users/login` | Public | Authenticate user & issue JWT |
| `GET` | `/api/users/profile` | Protected | Fetch current user profile |
| `GET` | `/api/users/google` | Public | Initiates Google OAuth 2.0 flow |
| `GET` | `/api/users/google/callback` | Public | Google OAuth redirect handler |

### 2. Crop Routes (`/api/crops`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/crops` | Public | List all crop records |
| `GET` | `/api/crops/search?q=` | Public | Search crops by name |
| `GET` | `/api/crops/:id` | Public | Get single crop details |
| `POST` | `/api/crops` | Protected | Create new crop record |
| `PUT` | `/api/crops/:id` | Protected | Update existing crop record |
| `DELETE` | `/api/crops/:id` | Protected | Delete crop record |

### 3. AI Routes (`/api/ai`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/ai/chat` | Protected | Query Google Gemini 3.1 Flash for crop advice |

### 4. Chat History & Analytics Routes (`/api/chat`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/chat/history` | Protected | Fetch all user conversations ordered newest first |
| `GET` | `/api/chat/history/:id` | Protected | Fetch single conversation with messages |
| `POST` | `/api/chat/save` | Protected | Save or update conversation |
| `POST` | `/api/chat/import` | Protected | Import conversation from valid JSON file |
| `GET` | `/api/chat/history/:id/export` | Protected | Export single conversation as JSON |
| `PATCH` | `/api/chat/history/:id/title` | Protected | Rename conversation title |
| `PATCH` | `/api/chat/history/:id/pin` | Protected | Toggle pin status (📌) |
| `PATCH` | `/api/chat/history/:id/favorite` | Protected | Toggle favorite status (⭐) |
| `DELETE` | `/api/chat/history/:id` | Protected | Delete conversation |
| `GET` | `/api/chat/analytics` | Protected | Fetch aggregated conversation metrics for dashboard |

---

## 🛢️ Database Schema (PostgreSQL)

### `users`
```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'farmer',
  location JSONB DEFAULT '{"district": "", "state": "Uttarakhand"}'::jsonb,
  phone VARCHAR(50) DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### `crops`
```sql
CREATE TABLE IF NOT EXISTS crops (
  id SERIAL PRIMARY KEY,
  crop_name VARCHAR(255) NOT NULL,
  soil_type VARCHAR(255) NOT NULL,
  season VARCHAR(255) NOT NULL,
  water_requirement VARCHAR(255) DEFAULT 'Not specified',
  fertilizer VARCHAR(255) DEFAULT 'Not specified',
  description TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### `chat_history`
```sql
CREATE TABLE IF NOT EXISTS chat_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) DEFAULT 'Conversation',
  session_name VARCHAR(255) DEFAULT 'Session',
  messages JSONB DEFAULT '[]'::jsonb,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 💻 Setup & Local Development Guide

### 1. Environment Configuration

#### Backend `.env` (Location: `backend/.env`)
```env
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/postgres
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/users/google/callback
CLIENT_REDIRECT_URL=http://localhost:3000/login
```

#### Frontend `.env.local` (Location: `crop-advisory/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/crops
```

---

### 2. Running the Server

#### Backend Express API Server
```bash
cd backend
npm install
npm run dev
```

#### Frontend Next.js Application
```bash
cd crop-advisory
npm install
npm run dev
```

Visit the application in your browser at `http://localhost:3000`.

---

## 🛠️ Production Build & Verification

To verify production compilation, run:
```bash
npm run build
```

This compiles Next.js App Router pages, generates static assets, and verifies TypeScript/ESLint validity.

---

## 🔍 Troubleshooting Guide

1. **PostgreSQL Database Connection Failure**:
   - Verify `DATABASE_URL` credentials and ensure SSL settings (`rejectUnauthorized: false` for Supabase) are active.
2. **Gemini API Error (403/429/500)**:
   - Ensure a valid `GEMINI_API_KEY` is provided in `backend/.env`.
3. **Authentication 401 Expiration**:
   - JWT tokens automatically trigger token refresh / redirection to `/login` when expired.