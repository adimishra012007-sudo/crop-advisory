# AI-Powered Crop Advisory System for Uttarakhand Farmers

This project is an AI-Powered Crop Advisory platform tailored for farmers in the hilly regions of Uttarakhand. It consists of a Next.js (App Router) frontend and an Express.js Node.js backend.

Project TBI ID: 26100438

---

## Folder Structure

```text
crop-advisory/
│
├── backend/                  # Express REST API Backend
│   ├── controllers/          # Request handlers
│   ├── data/                 # In-memory crop database (crops.js)
│   ├── middleware/           # 404, validation, and error middleware
│   ├── models/               # Crop model data helpers
│   ├── routes/               # Express routing config
│   ├── .env.example          # Template for backend env variables
│   ├── package.json          # Backend dependencies
│   ├── server.js             # Main backend server entry point
│   └── README.md             # Backend documentation
│
├── src/                      # Next.js Frontend
│   ├── app/                  # Next.js routes (pages & pages routing layout)
│   │   ├── about/            # Project overview page
│   │   ├── chatbot/          # AI chat interface (connects to backend search)
│   │   ├── contact/          # Support & feedback page
│   │   ├── crops/            # [NEW] Crops registry management dashboard (CRUD)
│   │   ├── showcase/         # UI kit component library playground
│   │   ├── layout.jsx        # Root HTML wrapper layout
│   │   └── page.jsx          # Landing page
│   │
│   ├── components/           # Reusable UI & Layout Components
│   │   ├── ui/               # Button, Input, Modal, Toast, Loader primitives
│   │   └── Navbar.jsx        # Navigation header
│   │
│   └── lib/                  # Frontend utilities
│       └── api.js            # [NEW] Centralized crop API fetch service
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
Configure the backend port by creating a `.env` file from the example template:
```bash
cp .env.example .env
```
Ensure the contents are:
```env
PORT=5000
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

| HTTP Method | Route | Description | Expected Status |
|:---|:---|:---|:---|
| **GET** | `/api/crops` | Retrieve all Uttarakhand crops | `200` OK |
| **GET** | `/api/crops/:id` | Fetch detailed information for one crop | `200` OK, `4404` |
| **GET** | `/api/crops/search?q=` | Search crops by name (live match) | `200` OK, `400` |
| **POST** | `/api/crops` | Register a new crop profile (with validation) | `201` Created, `400` |
| **PUT** | `/api/crops/:id` | Update properties of an existing crop profile | `200` OK, `404` |
| **DELETE** | `/api/crops/:id` | Remove a crop profile from the registry | `204` No Content |

---

## 4. Design Guidelines & Features
- **Loader Component Integration**: Spinners display automatically when querying lists, saving records, or searching.
- **Toast Component Alerts**: Dispatches success messages on successful creation/updates/deletions and red error warnings when an API transaction fails or connection is severed.
- **Fully Responsive & Dual Theme**: Adaptive layouts for mobile and desktop screens including premium light/dark styling.