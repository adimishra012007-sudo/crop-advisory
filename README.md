# AI-Powered Crop Advisory System for Uttarakhand Farmers

This project is an AI-Powered Crop Advisory platform tailored for farmers in the hilly regions of Uttarakhand. It consists of a Next.js (App Router) frontend and an Express.js Node.js backend connecting to a Supabase PostgreSQL database and the Google Gemini API.

Project TBI ID: 26100438

---

## Folder Structure

```text
crop-advisory/
│
├── backend/                  # Express REST API Backend
│   ├── config/               # Supabase PostgreSQL database connection pool
│   ├── controllers/          # Request handlers (userController, cropController, aiController)
│   ├── data/                 # Initial seed crop database (crops.js)
│   ├── middleware/           # 404, validation, rate limiting, and error middleware
│   ├── models/               # Relational wrappers (cropModel, userModel, chatHistoryModel)
│   ├── routes/               # Express routing config (userRoutes, cropRoutes, aiRoutes)
│   ├── services/             # Core external services (geminiService)
│   ├── .env.example          # Template for backend env variables
│   ├── package.json          # Backend dependencies
│   ├── server.js             # Main backend server entry point and DB connection
│   └── README.md             # Backend documentation
│
├── src/                      # Next.js Frontend
│   ├── app/                  # Next.js routes (pages & pages routing layout)
│   │   ├── about/            # Project overview page
│   │   ├── chatbot/          # AI chat interface (connects to backend Gemini API)
│   │   ├── contact/          # Support & feedback page
│   │   ├── crops/            # Crops registry management dashboard (CRUD)
│   │   ├── showcase/         # UI kit component library playground
│   │   ├── layout.jsx        # Root HTML wrapper layout
│   │   └── page.jsx          # Landing page
│   │
│   ├── components/           # Reusable UI & Layout Components
│   │   ├── ui/               # Button, Input, Modal, Toast, Loader primitives
│   │   └── Navbar.jsx        # Navigation header
│   │
│   └── lib/                  # Frontend utilities
│       ├── api.js            # Centralized API fetch service (includes askAIChat)
│       └── auth.js           # Client-side authentication service
│
├── package.json              # Frontend dependencies config
├── PROMPTS.md                # Prompt Engineering documentation
└── README.md                 # Root project documentation
```

---

## 1. Backend Setup & Startup

The backend server runs on `http://localhost:5000`.

### Install Packages
Navigate to the `backend` folder and install:
```bash
cd backend
npm install
```

### Environment Variables
Configure the backend port, database connection, and Google Gemini API key by creating a `.env` file from the example template:
```bash
cp .env.example .env
```
Ensure the contents include your Supabase connection string and Gemini API Key:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:adimishra1405@db.aanrctgfdkycdonrgott.supabase.co:6543/postgres
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:5000/api/users/google/callback
CLIENT_REDIRECT_URL=http://localhost:3000/login
JWT_SECRET=...

# Week 7 Google Gemini API configuration
GEMINI_API_KEY=your_gemini_api_key_here
```

### Run Backend
- **Development Mode** (with nodemon auto-restart):
  ```bash
  npm run dev
  ```
- **Production Mode**:
  ```bash
  npm start
  ```

---

## 2. Frontend Setup & Startup

The frontend application runs on `http://localhost:3000`.

### Install Packages
Navigate to the root directory and install:
```bash
npm install
```

### Run Frontend
- **Development Mode**:
  ```bash
  npm run dev
  ```
- **Production Mode (Build and Start)**:
  ```bash
  npm run build
  ```
  ```bash
  npm run start
  ```

---

## 3. REST API Endpoint Catalog

#### AI Advisory Endpoints (Base: `http://localhost:5000/api/ai`)

| HTTP Method | Route | Description | Expected Status |
|:---|:---|:---|:---|
| **POST** | `/chat` | Query the Gemini-1.5-flash AI advisor (JWT Protected) | `200` OK, `400`, `401`, `429`, `500` |

#### Crops Registry Endpoints (Base: `http://localhost:5000/api/crops`)

| HTTP Method | Route | Description | Expected Status |
|:---|:---|:---|:---|
| **GET** | `/` | Retrieve all Uttarakhand crops | `200` OK |
| **GET** | `/:id` | Fetch detailed information for one crop | `200` OK, `404` |
| **GET** | `/search?q=` | Search crops by name (live match) | `200` OK, `400` |
| **POST** | `/` | Register a new crop profile (with express-validator) | `201` Created, `400` |
| **PUT** | `/:id` | Update properties of an existing crop profile (with validation) | `200` OK, `400`, `404` |
| **DELETE** | `/:id` | Remove a crop profile from the registry | `204` No Content |

#### Authentication Endpoints (Base: `http://localhost:5000/api/users`)

| HTTP Method | Route | Description | Expected Status |
|:---|:---|:---|:---|
| **POST** | `/signup` | Register new user with input validation (Rate Limited) | `201` Created, `400`, `429` |
| **POST** | `/login` | Authenticate credentials & return JWT (Rate Limited) | `200` OK, `401`, `429` |
| **GET** | `/profile` | Fetch active user credentials (JWT Protected) | `200` OK, `401` |
| **GET** | `/google` | Navigates to Google consent screen for Single Sign-On | `302` Redirect |
| **GET** | `/google/callback` | OAuth redirect handling, user provisioning, and login | `302` (Redirects to FE) |

---

## 4. Key Additions & Design Implementations

- **Google Gemini AI Integration**: Seamless connection to the `gemini-1.5-flash` model. Prompts are carefully restricted to answer only agricultural or crop advisory queries (especially regarding Uttarakhand) and politely reject other inputs.
- **Protected Chatbot Route**: The AI chatbot requires user authentication. If the JWT token expires, the client API automatically redirects the user to `/login`.
- **Loading State & Button Protection**: When a query is processing, the send button is disabled and a loader appears to prevent multiple simultaneous API hits.
- **Friendly Toast Error Messaging**: Catches API unavailability, internet disconnects, Gemini timeouts, quota limits, and renders clean notification banners, avoiding stack traces.
- **Google Sign-In**: SSO integrated into login/signup page with auto-provisioning and callback redirections.
- **Farmer Dashboard**: Summarizes account info, crop database counts, chatbot history sessions, and profiles.
- **Rate Limiting**: Custom rate limiting applied on security-sensitive paths to block automated scraping or bruteforcing.
- **Clean Architecture separation**:
  - `geminiService`: Interacts with `@google/generative-ai` package, enforces 15-second timeouts, and maps HTTP error status codes.
  - `aiController`: Handles input validations and packages responses.
  - `aiRoutes`: Exposes route points and applies route security middleware (`protect`).

---

## 5. Troubleshooting & Support

- **Gemini API Error (504 Timeout)**: Check the internet connection on the server host. If the Gemini API doesn't return a response in 15 seconds, the server aborts the request to prevent thread hanging.
- **Database Connection Failure (503 Service Unavailable)**: Ensure PostgreSQL connection credentials in `backend/.env` match Supabase.
- **Rate Limit (429 Too Many Requests)**: If the API quota is reached on the free tier, wait a few minutes before querying the chatbot again.
- **JWT Expired (401 Unauthorized)**: The frontend redirects you back to `/login` to acquire a fresh authorization token.