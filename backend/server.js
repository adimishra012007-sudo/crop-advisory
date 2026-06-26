import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cropRoutes from "./routes/cropRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all requests to support cross-origin API calls from the frontend
app.use(cors());

// Parse incoming requests with JSON payloads
app.use(express.json());

// Base diagnostic endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date() });
});

// Register Crop REST routes
app.use("/api/crops", cropRoutes);

// Catch 404 and forward to error handler
app.use(notFound);

// Custom error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || "development"} mode on http://localhost:${PORT}`);
});
