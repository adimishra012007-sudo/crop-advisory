# AI-Powered Crop Advisory System for Uttarakhand Farmers

An AI-Powered Crop Advisory platform tailored for mountain agriculture and farmers in Uttarakhand. The application features a Next.js (App Router) frontend deployed on **Vercel** and an Express.js Node.js backend deployed on **Render**, connected to a Supabase PostgreSQL database and Google Gemini AI API.

**Project TBI ID**: 26100438

---

## 🌐 Production Deployment Links

- **Frontend (Vercel)**: [https://crop-advisory-tau.vercel.app](https://crop-advisory-tau.vercel.app)
- **Backend API (Render)**: [https://crop-advisory-p0ng.onrender.com](https://crop-advisory-p0ng.onrender.com)
- **API Health Check**: [https://crop-advisory-p0ng.onrender.com/api/health](https://crop-advisory-p0ng.onrender.com/api/health)

---

## 🌟 Key Features

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

6. **Responsive & Accessible UI**
   - Dark and Light mode toggle with local storage persistence.
   - Tailored UI aesthetics with glassmorphism effects, custom color system, and mobile drawer navigation.

---

## 🛠️ Technologies Used

### Frontend Stack
- **Framework**: Next.js 16 (App Router with Turbopack)
- **Library**: React 19
- **Styling**: Tailwind CSS, Vanilla CSS design tokens
- **Data Visualization**: Chart.js & `react-chartjs-2`
- **Icons & Markdown**: Lucide React, `react-markdown`, `remark-gfm`
- **Hosting**: Vercel

### Backend Stack
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: PostgreSQL hosted on Supabase (`pg` connection pooler)
- **AI Integration**: Google Generative AI SDK (`@google/generative-ai`)
- **Authentication**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`
- **OAuth**: Google OAuth 2.0 REST Flow
- **Hosting**: Render Web Services

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
├── .env.example              # Frontend Environment variables template
├── package.json              # Frontend dependencies config
├── walkthrough.md            # System Architecture & Technical Walkthrough
└── README.md                 # Complete documentation guide
```

---

## 🚀 REST API Endpoint Specification

### 1. Diagnostic Health Route
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Backend health check (Returns `{"status": "healthy"}`) |

### 2. User & Auth Routes (`/api/users`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/users/signup` | Public | Register a new user |
| `POST` | `/api/users/login` | Public | Authenticate user & issue JWT |
| `GET` | `/api/users/profile` | Protected | Fetch current user profile |
| `GET` | `/api/users/google` | Public | Initiates Google OAuth 2.0 flow |
| `GET` | `/api/users/google/callback` | Public | Google OAuth redirect handler |

### 3. Crop Routes (`/api/crops`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/crops` | Public | List all crop records |
| `GET` | `/api/crops/search?q=` | Public | Search crops by name |
| `GET` | `/api/crops/:id` | Public | Get single crop details |
| `POST` | `/api/crops` | Protected | Create new crop record |
| `PUT` | `/api/crops/:id` | Protected | Update existing crop record |
| `DELETE` | `/api/crops/:id` | Protected | Delete crop record |

### 4. AI Routes (`/api/ai`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/ai/chat` | Protected | Query Google Gemini 3.1 Flash for crop advice |

### 5. Chat History & Analytics Routes (`/api/chat`)
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

## 🔑 Environment Variables Configuration

### Backend Environment Variables (`backend/.env`)
```env
PORT=5000
DATABASE_URL=postgresql://postgres:<password>@db.<ref>.supabase.co:6543/postgres
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GOOGLE_CALLBACK_URL=https://crop-advisory-p0ng.onrender.com/api/users/google/callback
CLIENT_REDIRECT_URL=https://crop-advisory-tau.vercel.app/login
GEMINI_API_KEY=your_google_gemini_api_key
```

### Frontend Environment Variables (`.env.local` / Vercel)
```env
NEXT_PUBLIC_API_URL=https://crop-advisory-p0ng.onrender.com
```

---

## 💻 Installation & Setup Guide

### 1. Backend Server Setup
```bash
cd backend
npm install
npm run dev
```

### 2. Frontend Next.js App Setup
```bash
cd crop-advisory
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📸 Screenshots

*(Place screenshots of the application below)*

- **Landing Page**: `![Landing Page](public/screenshots/landing.png)`
- **AI Chatbot Interface**: `![AI Chatbot Interface](public/screenshots/chatbot.png)`
- **Crop Registry Dashboard**: `![Crop Registry Dashboard](public/screenshots/crops.png)`
- **Analytics Dashboard**: `![Analytics Dashboard](public/screenshots/analytics.png)`

---

## 🔍 Troubleshooting Guide

1. **PostgreSQL Connection Failures**:
   - Ensure your Supabase connection URI uses port `6543` to leverage connection pooling.
2. **Google OAuth `redirect_uri_mismatch` Error**:
   - Verify `GOOGLE_CALLBACK_URL` on Render matches the Authorized redirect URI in Google Cloud Console: `https://crop-advisory-p0ng.onrender.com/api/users/google/callback`.
3. **Gemini API Error (429 / 400)**:
   - Verify `GEMINI_API_KEY` is defined in backend environment variables.

---

## 🔮 Future Improvements

- Multilingual support for Hindi and regional Kumaoni / Garhwali dialects.
- Image recognition module for automatic leaf disease diagnosis.
- Real-time mandi crop price indicators via Govt. Agri API integration.
- Offline-first Progressive Web App (PWA) capabilities for rural farmers.