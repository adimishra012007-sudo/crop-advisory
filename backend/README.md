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

### Base URL: `http://localhost:5000/api/crops`

| HTTP Method | Endpoint | Description | Status Codes |
|:---|:---|:---|:---|
| **GET** | `/` | Retrieve all crop records | `200` OK, `500` Error |
| **GET** | `/search?q=value` | Search crop records by `cropName` (case-insensitive substring) | `200` OK, `400` Bad Request, `500` Error |
| **GET** | `/:id` | Retrieve details for a single crop | `200` OK, `404` Not Found, `500` Error |
| **POST** | `/` | Create a new crop record | `201` Created, `400` Validation Error, `500` Error |
| **PUT** | `/:id` | Update an existing crop record | `200` OK, `400` Validation Error, `404` Not Found, `500` Error |
| **DELETE** | `/:id` | Delete a crop record | `204` No Content, `404` Not Found, `500` Error |

---

## Sample JSON Data Formats

### Crop Request Body (POST / PUT)
```json
{
  "cropName": "Finger Millet (Mandua)",
  "soilType": "Sandy loam",
  "season": "Kharif",
  "waterRequirement": "Low",
  "fertilizer": "Organic Jivamrit",
  "description": "Traditional nutritious crop grown on sloped fields."
}
```

### Successful JSON Response (Mapped to camelCase)
```json
{
  "id": "1",
  "cropName": "Finger Millet (Mandua)",
  "soilType": "Sandy loam",
  "season": "Kharif",
  "waterRequirement": "Low",
  "fertilizer": "Organic Jivamrit",
  "description": "Traditional nutritious crop grown on sloped fields."
}
```
