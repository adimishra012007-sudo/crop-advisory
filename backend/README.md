# AI Crop Advisory Backend Server

This is the backend REST API server for the AI Crop Advisory project, built using Node.js, Express.js, and Supabase PostgreSQL (via the `pg` pool driver).

## Features
- **Persistent Data Store**: Powered by PostgreSQL database hosted on Supabase.
- **Automated Seeding**: Automatically checks and seeds the database on connection with 10 crops tailored to Uttarakhand hills if the `crops` table is empty.
- **Unified Schemas**: Structured relational tables for `crops`, `users`, and `chat_history`.
- **Clean Architecture**: Folder structure divided into database configuration, PostgreSQL query models, controllers, routes, and middleware.
- **Robust Error Handling & Validation**: Centralized Express error handler returning structured JSON outputs with standard HTTP status codes.

---

## Folder Structure

```text
backend/
├── config/
│   └── db.js            # PostgreSQL database connection configuration and seeding
├── controllers/
│   └── cropController.js # Request route handlers
├── data/
│   └── crops.js         # Default initial crop records (source for database seeding)
├── middleware/
│   └── errorHandler.js  # Catch-all 404 and global JSON error formatting
│   └── dbCheck.js       # Health check middleware checking PostgreSQL connection
├── models/
│   ├── userModel.js     # PostgreSQL queries wrapper for users
│   ├── chatHistoryModel.js # PostgreSQL queries wrapper for chat histories
│   └── cropModel.js     # PostgreSQL queries wrapper for crops
├── routes/
│   └── cropRoutes.js    # Express REST API routes mappings
├── .env                 # Local configuration variables (ignored by Git)
├── .env.example         # Template for environment configuration variables
├── package.json         # Package configuration and dependencies
└── server.js            # Application entrypoint
```

---

## Setup & Installation

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended).

### 2. Database Connection
You must have a Supabase project created. Copy your transaction pooler connection string (port 6543) or direct connection string from the Supabase Dashboard under **Project Settings > Database**.

### 3. Install Dependencies
Navigate to the `backend` folder and install all required npm packages:
```bash
cd backend
npm install
```
This installs core packages like `express`, `cors`, `dotenv`, and `pg`.

### 4. Environment Configuration
Create a `.env` file in the root of the `backend` folder:
```bash
cp .env.example .env
```
Open `.env` and fill in your Supabase connection string:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:adimishra1405@db.aanrctgfdkycdonrgott.supabase.co:6543/postgres
```
> [!IMPORTANT]
> The database connection uses port `6543` to leverage connection pooling and bypass potential ISP blocks on port `5432`. Never commit your `.env` file to Git.

---

## Render Deployment Instructions

- **Backend Production Base URL**: `https://crop-advisory-backend.onrender.com`
- **Health Check Endpoint**: `https://crop-advisory-backend.onrender.com/api/health`

### 1. Render Service Configuration
- **Environment**: Node
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 2. Required Environment Variables on Render
Add these key-value pairs under **Environment** settings in Render:

- `PORT`: Assigned dynamically by Render (or `5000`)
- `DATABASE_URL`: `postgresql://postgres:<password>@db.<ref>.supabase.co:6543/postgres`
- `JWT_SECRET`: Secret key for JWT verification
- `GOOGLE_CLIENT_ID`: Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth Client Secret
- `GOOGLE_CALLBACK_URL`: `https://<render-backend-app>.onrender.com/api/users/google/callback`
- `CLIENT_REDIRECT_URL`: `https://<vercel-frontend-app>.vercel.app/login`
- `GEMINI_API_KEY`: Google Gemini API Key

### 3. Health Check Configuration
- **Health Check Path**: `/api/health`

---

## Database Schemas

The application defines three tables designed for the AI Crop Advisory system:

### 1. Crops Table (`crops`)
Stores structural crop recommendations, tailored to geographical parameters:
- `id` (SERIAL, Primary Key): Unique identifier (returned as a String to the frontend).
- `crop_name` (VARCHAR(255), NOT NULL): Common name of the crop.
- `soil_type` (VARCHAR(255), NOT NULL): Ideal soil conditions for cultivation.
- `season` (VARCHAR(255), NOT NULL): Sowing and cultivation season (e.g., Kharif, Rabi).
- `water_requirement` (VARCHAR(255), DEFAULT 'Not specified'): Water and irrigation metrics.
- `fertilizer` (VARCHAR(255), DEFAULT 'Not specified'): Traditional/organic fertilizer recommendations.
- `description` (TEXT, DEFAULT ''): Detailed description of characteristics and hill regions.
- `created_at` / `updated_at` (TIMESTAMP WITH TIME ZONE): Auto-generated timestamps.

### 2. Users Table (`users`)
Maintains profiles of registered farmers and advisory admins:
- `id` (SERIAL, Primary Key): Unique user identifier.
- `name` (VARCHAR(255), NOT NULL): Full name of the user.
- `email` (VARCHAR(255), UNIQUE, NOT NULL): User email address.
- `password` (VARCHAR(255), NOT NULL): Hashed user password.
- `role` (VARCHAR(50), DEFAULT 'farmer'): System permission role (farmer, advisor, admin).
- `location` (JSONB, DEFAULT '{"district": "", "state": "Uttarakhand"}'): Home location parameters.
- `phone` (VARCHAR(50), DEFAULT ''): Contact number.
- `created_at` / `updated_at` (TIMESTAMP WITH TIME ZONE): Auto-generated timestamps.

### 3. Chat History Table (`chat_history`)
Maintains logs of interactions with the AI advisory chatbot:
- `id` (SERIAL, Primary Key): Unique session identifier.
- `user_id` (INTEGER, Foreign Key referencing `users(id)` ON DELETE SET NULL): Associated user.
- `session_name` (VARCHAR(255), DEFAULT 'Session [Date]'): Descriptive session name.
- `messages` (JSONB, DEFAULT '[]'): Array of message objects, containing:
  - `sender` (String, user/ai)
  - `text` (String)
  - `timestamp` (Date/String)
- `created_at` / `updated_at` (TIMESTAMP WITH TIME ZONE): Auto-generated timestamps.

---

## Running the Server

- **Development Mode** (with nodemon auto-restart):
  ```bash
  npm run dev
  ```
- **Production Mode**:
  ```bash
  npm start
  ```

On startup, the app establishes connection to Supabase and initializes tables if they do not exist. If the `crops` table is empty, the database seeds itself with the initial crops automatically. The server runs on [http://localhost:5000](http://localhost:5000).

---

## REST API Documentation

### Base URL: `http://localhost:5000`

#### Crop Registry Endpoints (Base: `/api/crops`)

| HTTP Method | Endpoint | Description | Status Codes |
|:---|:---|:---|:---|
| **GET** | `/` | Retrieve all crop records | `200` OK, `500` Error |
| **GET** | `/search?q=value` | Search crop records by `cropName` (case-insensitive substring) | `200` OK, `400` Bad Request, `500` Error |
| **GET** | `/:id` | Retrieve details for a single crop | `200` OK, `404` Not Found, `500` Error |
| **POST** | `/` | Create a new crop record (with Validation) | `201` Created, `400` Validation Error, `500` Error |
| **PUT** | `/:id` | Update an existing crop record (with Validation) | `200` OK, `400` Validation Error, `404` Not Found, `500` Error |
| **DELETE** | `/:id` | Delete a crop profile | `204` No Content, `404` Not Found, `500` Error |

#### User & Authentication Endpoints (Base: `/api/users`)

| HTTP Method | Endpoint | Description | Status Codes |
|:---|:---|:---|:---|
| **POST** | `/signup` | Create a new user profile (Rate Limited) | `201` Created, `400` Validation/Duplicate, `429` |
| **POST** | `/login` | Authenticate existing user and return JWT (Rate Limited) | `200` OK, `400` Validation, `401` Unauthorized, `429` |
| **GET** | `/profile` | Get current user's profile metadata (JWT Protected) | `200` OK, `401` Unauthorized, `500` |
| **GET** | `/google` | Starts the Google OAuth 2.0 redirection flow | `302` Found (Redirects to Google) |
| **GET** | `/google/callback` | Google OAuth callback handler returning JWT | `302` Found (Redirects to `/login?token=JWT`) |

---

## 1. Google OAuth Setup Guide
To enable Google Sign-In, obtain your API credentials from the [Google Cloud Console](https://console.cloud.google.com/):
1. Create a new Project or select an existing one.
2. Go to **APIs & Services > Credentials** and click **Create Credentials > OAuth client ID**.
3. Choose **Web application** as the Application type.
4. Under **Authorized redirect URIs**, add the backend callback URL:
   `http://localhost:5000/api/users/google/callback`
5. Click **Create** to obtain your Client ID and Client Secret.
6. Paste these into your backend `.env` variables.

---

## 2. Environment Variables Mappings
Add these variables to your local backend `.env` file:
```env
# Server
PORT=5000
DATABASE_URL=your_supabase_postgresql_connection_string

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/users/google/callback
CLIENT_REDIRECT_URL=http://localhost:3000/login
```

---

## 3. Rate Limiting Protection
We protect user auth endpoints (`POST /api/users/login` and `POST /api/users/signup`) using `express-rate-limit`:
- **Limit**: 5 requests per 15-minute window per IP.
- **Exceeded Response**: Status code `429 Too Many Requests` returning JSON:
  ```json
  {
    "message": "Too many attempts. Please try again later."
  }
  ```

---

## 4. Input Validation Rules
Input validation is enforced using `express-validator`:
- **Signup**:
  - `name`: Required, non-empty.
  - `email`: Required, valid email format.
  - `password`: Required, minimum 6 characters.
  - `role`: Required (e.g. `farmer`, `advisor`).
- **Login**:
  - `email`: Required, valid email format.
  - `password`: Required, non-empty.
- **Crop CRUD**:
  - `cropName`: Required, non-empty.
  - `season`: Required, non-empty.
  - `soilType`: Required, non-empty.
- **Validation Error Format**:
  ```json
  {
    "error": "Validation Error",
    "details": {
      "email": "Must be a valid email address.",
      "password": "Password must be at least 6 characters long."
    }
  }
  ```

---

## 5. Security & Authentication Flow
```mermaid
sequenceDiagram
    participant User as Client Browser
    participant FE as Next.js Frontend (Port 3000)
    participant BE as Express Backend (Port 5000)
    participant DB as PostgreSQL Database
    participant Google as Google OAuth Server

    Note over User, FE: Standard Login/Signup Flow
    User->>FE: Fill form & click submit
    FE->>BE: POST /api/users/login (or signup)
    Note over BE: Middleware check: Rate Limit & express-validator
    BE->>DB: Verify credentials / Create account
    DB-->>BE: User data
    BE-->>FE: Return JSON with JWT
    FE->>FE: Save JWT & User to localStorage

    Note over User, FE: Google Sign-in Flow
    User->>FE: Click "Continue with Google"
    FE->>BE: Navigates to GET /api/users/google
    BE-->>User: Redirects to Google Consent Screen
    User->>Google: Authenticates
    Google-->>BE: Redirect with code to GET /api/users/google/callback
    BE->>Google: Exchange code for Access Token
    Google-->>BE: Access Token
    BE->>Google: Fetch User Profile (email & name)
    Google-->>BE: Profile Info
    BE->>DB: Check if email exists
    Note over BE, DB: If exists: login. If not: create new user.
    BE-->>User: Redirects to FE: http://localhost:3000/login?token=JWT
    FE->>FE: Parse URL token & fetch profile metadata
    FE->>FE: Save JWT & User to localStorage
    FE->>User: Route to /profile
```
