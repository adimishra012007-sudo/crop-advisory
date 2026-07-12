# AI-Powered Crop Advisory System for Uttarakhand Farmers

This project is an AI-Powered Crop Advisory platform tailored for farmers in the hilly regions of Uttarakhand. It consists of a Next.js (App Router) frontend and an Express.js Node.js backend connecting to a Supabase PostgreSQL database.

Project TBI ID: 26100438

---

## Folder Structure

```text
crop-advisory/
│
├── backend/                  # Express REST API Backend
│   ├── config/               # Supabase PostgreSQL database connection pool
│   ├── controllers/          # Request handlers
│   ├── data/                 # Initial seed crop database (crops.js)
│   ├── middleware/           # 404, validation, and error middleware
│   ├── models/               # Relational wrappers (cropModel, userModel, chatHistoryModel)
│   ├── routes/               # Express routing config
│   ├── .env.example          # Template for backend env variables
│   ├── package.json          # Backend dependencies
│   ├── server.js             # Main backend server entry point and DB connection
│   └── README.md             # Backend documentation
│
├── src/                      # Next.js Frontend
│   ├── app/                  # Next.js routes (pages & pages routing layout)
│   │   ├── about/            # Project overview page
│   │   ├── chatbot/          # AI chat interface (connects to backend search)
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
│       └── api.js            # Centralized crop API fetch service
│
├── package.json              # Frontend dependencies config
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
Configure the backend port and database connection by creating a `.env` file from the example template:
```bash
cp .env.example .env
```
Ensure the contents include your Supabase connection string:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:adimishra1405@db.aanrctgfdkycdonrgott.supabase.co:6543/postgres
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
  npm run start
  ```

---

## 3. REST API Endpoint Catalog

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

- **Google Sign-In**: "Continue with Google" buttons integrated seamlessly into `/login` and `/signup` with standard multi-color Google branding. Callback parses the redirected query token, fetches profile context from the server, stores authentication state, and redirects to `/profile`.
- **Protected Pages**: Both `/profile` and the new `/dashboard` routes verify local state on render. Unauthenticated users are redirected back to `/login` immediately. If a token has expired or is invalid, the API returns a 401 Unauthorized, automatically triggering logout and routing cleanup.
- **Farmer Dashboard**: Displays credentials, crops database count dynamically fetched from the API, active AI chatbot session count, and current account status.
- **Dynamic Navbar Synchronization**: Dynamically updates links depending on whether a session is active:
  - Logged In: Displays "Home", "Dashboard", "Chatbot", "Crops", "About", "Contact", the Profile Icon, and a "Logout" action.
  - Logged Out: Hides "Dashboard" and "Logout" and points the Profile Icon to `/login`.
- **DDoS/Brute Force Rate Limiting**: Limit of 5 logins/signups per 15 minutes per IP address. Exceeded limits throw a standard `429 Too Many Requests` error with user-friendly warnings.
- **Input Validation**: Employs `express-validator` on all auth forms and crop management requests to block bad inputs early at the middleware level.
- **Error Formatting**: The global error boundary intercepts database, network, validation, and status errors to format clean user-friendly notices in toasts, completely disabling developer stack trace leaks.