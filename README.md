# AI Crop Advisory System

An AI-powered smart agriculture and crop management advisory platform tailored for hill farming in Uttarakhand.

## 🌐 Live Demo

- **Frontend**: [https://crop-advisory-tau.vercel.app](https://crop-advisory-tau.vercel.app)
- **Backend**: [https://crop-advisory-p0ng.onrender.com](https://crop-advisory-p0ng.onrender.com)

## 🎥 Demo Video

Demo Video:
(Add YouTube Unlisted link after recording)

## 📸 Screenshots

- **Home**: `![Home Page](public/screenshots/home.png)`
- **Dashboard**: `![Dashboard](public/screenshots/dashboard.png)`
- **Crops**: `![Crops Registry](public/screenshots/crops.png)`
- **AI Chatbot**: `![AI Chatbot Interface](public/screenshots/chatbot.png)`

## ✨ Features

- **User Authentication**: Secure user registration, JWT-based login, session persistence, and Google OAuth 2.0 single sign-on integration.
- **Crop Registry (CRUD)**: Full database management (Create, Read, Update, Delete) for hill crops (soil type, climate, water requirements, recommended fertilizer) with live debounced search by crop name.
- **AI-Powered Agro Assistant**: Direct integration with Google Gemini 3.1 Flash for instant advisory on crop diseases, pest management, terrace irrigation, and organic farming techniques (Jivamrit/Bijamrit).
- **Rich Markdown Formatting**: Supports headings, lists, tables, code blocks, and blockquotes with custom ReactMarkdown components tailored for both light and dark themes.
- **Message Utility Controls**: One-click **Copy AI Response** button per message, auto-scrolling to latest messages, and automated smart session titling.
- **Persistent Chat Sessions & Sidebar History**: PostgreSQL JSONB-backed conversation history persistence with a ChatGPT-style sidebar and `+ New Chat` workflow.
- **Conversation Organization**: Instant search filtering, **Pinned Chats (📌)** with HTML5 drag-and-drop reordering, **Favorite Chats (⭐)**, and inline title renaming (Enter to save, Escape to cancel).
- **Data Export & Import**: Export conversation sessions to formatted `.json` files and import external `.json` sessions with strict validation and auto-opening.
- **Analytics Dashboard**: 8 stat cards (Total Conversations, Messages, Favorites, Pinned, Average Messages, Longest Chat, Oldest/Latest Activity Dates) and 3 interactive Chart.js visualizations (`Doughnut`, `Bar`, `Line`).
- **Responsive & Accessible Design**: Seamless light/dark mode toggling, glassmorphism UI, accessible form field bindings, keyboard Escape key modal dismissal, and responsive drawer navigation on mobile viewports.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router with Turbopack)
- **UI & Styling**: React 19, Tailwind CSS v4, Vanilla CSS tokens
- **Charts & Markdown**: Chart.js, `react-chartjs-2`, `react-markdown`, `remark-gfm`

### Backend
- **Runtime & Framework**: Node.js (v18+), Express.js
- **Services & ORM**: PostgreSQL (`pg` pooler), custom ORM models

### Database
- **Database**: PostgreSQL hosted on Supabase (`pg` connection pooler)

### Authentication
- **Security**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, Google OAuth 2.0 REST flow

### AI
- **LLM Engine**: Google Gemini API (`@google/generative-ai`)

### Deployment
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render Web Services

## 🚀 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/adimishra012007-sudo/crop-advisory.git
cd crop-advisory
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Environment Variables

Create `.env` in `backend/`:
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

Create `.env.local` in project root:
```env
NEXT_PUBLIC_API_URL=https://crop-advisory-p0ng.onrender.com
```

### 4. Run Backend
```bash
cd backend
npm run dev
```

### 5. Run Frontend
```bash
# In project root
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📄 API Documentation

### Health Check
- `GET /api/health` - Diagnostic health check returning server status.

### Authentication & User Management (`/api/users`)
- `POST /api/users/signup` - Register a new user (farmer/advisor/admin).
- `POST /api/users/login` - Authenticate user credentials and issue JWT.
- `GET /api/users/profile` - Fetch profile of currently authenticated user.
- `GET /api/users/google` - Initiate Google OAuth 2.0 authentication flow.
- `GET /api/users/google/callback` - Handle Google OAuth 2.0 callback redirect.

### Crop Registry Management (`/api/crops`)
- `GET /api/crops` - Retrieve all registered crop profiles.
- `GET /api/crops/search?q=:query` - Search crop profiles by name.
- `GET /api/crops/:id` - Fetch details for a specific crop profile by ID.
- `POST /api/crops` - Add a new crop profile (Protected).
- `PUT /api/crops/:id` - Update an existing crop profile by ID (Protected).
- `DELETE /api/crops/:id` - Remove a crop profile by ID (Protected).

### AI Advisory Endpoint (`/api/ai`)
- `POST /api/ai/chat` - Submit farmer query to Google Gemini 3.1 Flash AI assistant (Protected).

### Chat History & Analytics (`/api/chat`)
- `GET /api/chat/history` - Fetch all saved user conversations (Protected).
- `GET /api/chat/history/:id` - Fetch detailed messages for a specific conversation (Protected).
- `POST /api/chat/save` - Save or update a conversation session (Protected).
- `POST /api/chat/import` - Import a conversation from a validated JSON object (Protected).
- `GET /api/chat/history/:id/export` - Export a conversation session as JSON payload (Protected).
- `PATCH /api/chat/history/:id/title` - Rename conversation title (Protected).
- `PATCH /api/chat/history/:id/pin` - Toggle pin status (📌) for conversation (Protected).
- `PATCH /api/chat/history/:id/favorite` - Toggle favorite status (⭐) for conversation (Protected).
- `DELETE /api/chat/history/:id` - Delete a conversation session (Protected).
- `GET /api/chat/analytics` - Retrieve aggregated conversation metrics for dashboard analytics (Protected).

## 📁 Folder Structure

```text
crop-advisory/
├── backend/                  # Express.js API Server
│   ├── config/               # Database connection pool & migration setup (db.js)
│   ├── controllers/          # Business logic handlers (user, crop, ai, chat)
│   ├── data/                 # Initial seed crop datasets (crops.js)
│   ├── middleware/           # Auth JWT protection, dbCheck, rateLimiter, validation, errorHandler
│   ├── models/               # ORM database query models (userModel, cropModel, chatHistoryModel)
│   ├── routes/               # Express routing definitions (user, crop, ai, chat)
│   ├── services/             # Gemini API integration wrapper (geminiService.js)
│   ├── .env.example          # Backend environment variables template
│   ├── package.json          # Backend dependencies manifest
│   └── server.js             # Express application entry point
│
├── src/                      # Next.js 16 (App Router) Frontend
│   ├── app/                  # Application routes & layouts
│   │   ├── about/            # About project page
│   │   ├── chatbot/          # AI Chatbot interface page
│   │   ├── contact/          # Support & help contact page
│   │   ├── crops/            # Crop database CRUD page
│   │   ├── dashboard/        # Farmer analytics dashboard page
│   │   ├── login/            # Login authentication page
│   │   ├── profile/          # Farmer profile page
│   │   ├── signup/           # User registration page
│   │   ├── showcase/         # Component UI library showcase page
│   │   ├── layout.jsx        # Root HTML layout wrapper
│   │   ├── page.jsx          # Homepage landing view
│   │   └── globals.css       # Global styles & Tailwind CSS directives
│   │
│   ├── components/           # React UI components & Header/Footer
│   │   ├── ui/               # Reusable primitives (Button, Input, Modal, Toast, Loader)
│   │   ├── FeatureCard.jsx   # Landing feature card component
│   │   ├── Features.jsx      # Landing features grid component
│   │   ├── Footer.jsx        # Global application footer
│   │   ├── Hero.jsx          # Landing hero header component
│   │   ├── Navbar.jsx        # Responsive navigation bar with dark mode toggle
│   │   └── ThemeToggle.jsx   # SSR-safe dark/light mode toggle component
│   │
│   └── lib/                  # Frontend utilities & API service client
│       ├── api.js            # API fetch service helper
│       └── auth.js           # Client auth token & storage helper
│
├── .env.example              # Frontend environment variables template
├── next.config.mjs           # Next.js configuration
├── package.json              # Frontend dependencies manifest
└── README.md                 # System documentation & portfolio guide
```

## 🏗️ Architecture

The **AI Crop Advisory System** utilizes a decoupled client-server architecture:

1. **Client Layer (Next.js 16 App Router)**: Built with React 19 and Tailwind CSS. It communicates asynchronously with the backend API via native `fetch` wrappers handling JWT bearer tokens. Chart.js components are dynamically imported for optimal client loading performance.
2. **Server Layer (Express.js Node.js API)**: Implements RESTful architecture with structured controllers, custom ORM models, input validation middleware, rate-limiting, and error handling.
3. **AI Engine Layer (Google Gemini 3.1 Flash)**: The backend securely proxies prompts to Google's Gemini LLM via `@google/generative-ai` with system instructions tailored for Uttarakhand agricultural conditions, avoiding API key exposure on the frontend.
4. **Database Layer (Supabase PostgreSQL)**: Uses a transactional relational database with JSONB support to store user profiles, crop management records, and rich conversation session histories.

## ⚠️ Known Limitations

- **Free Tier Server Cold Starts**: The backend API is hosted on Render's free tier, which may experience an initial 30-50 second delay on first request after periods of inactivity.
- **Language Support**: Advisory responses are currently focused in English and Hindi text scripts; direct native audio generation for Garhwali and Kumaoni dialects is planned for future releases.
- **Internet Connectivity**: Requires an active internet connection to communicate with the cloud-hosted backend and Gemini AI API.

## 👏 Credits & Acknowledgements

- **OpenAI ChatGPT**: Used for design inspiration, architectural planning, and prompt engineering assistance.
- **Google Gemini API**: AI LLM engine power for regional crop advisory responses.
- **Next.js**: React framework powering the frontend application.
- **Express**: Fast, unopinionated Node.js web framework for the backend API.
- **Supabase**: Managed PostgreSQL database platform.
- **Render**: Cloud hosting provider for the Express backend server.
- **Vercel**: Cloud platform for hosting the Next.js frontend application.
- **Tailwind CSS**: Utility-first CSS framework for design system styling.