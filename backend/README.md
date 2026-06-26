# AI Crop Advisory Backend Server

This is the backend REST API server for the AI Crop Advisory project. Built using Node.js, Express.js, and an in-memory data store.

## Features
- In-memory database storing crops tailored to Uttarakhand hills.
- Complete CRUD REST API endpoints (`GET`, `POST`, `PUT`, `DELETE`).
- Real-time search query matching by `cropName`.
- Input validation for required crop fields.
- Custom middleware for CORS, 404 Route Not Found, and Global Error Handling.

---

## Setup & Installation

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended).

### 2. Install Dependencies
Navigate to the `backend` folder and install all required npm packages:
```bash
cd backend
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root of the `backend` folder (or copy `.env.example`):
```bash
cp .env.example .env
```
Ensure the port is set to `5000`:
```env
PORT=5000
```

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

The server runs on [http://localhost:5000](http://localhost:5000).

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

### Sample JSON Data Formats

#### Crop Request Body (POST / PUT)
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

#### Validation Error Response (400 Bad Request)
```json
{
  "error": "Validation Error",
  "details": {
    "cropName": "Crop name is required.",
    "soilType": "Soil type is required.",
    "season": "Season is required."
  }
}
```
