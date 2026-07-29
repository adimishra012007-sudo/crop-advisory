import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cropRoutes from "./routes/cropRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Helper to extract base origin from URL
const getClientOrigin = (urlStr) => {
  if (!urlStr) return null;
  try {
    return new URL(urlStr).origin;
  } catch {
    return urlStr;
  }
};

const clientRedirectOrigin = getClientOrigin(process.env.CLIENT_REDIRECT_URL);

const allowedOrigins = new Set([
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  ...(clientRedirectOrigin ? [clientRedirectOrigin] : []),
]);

// Configure CORS for localhost development and future Vercel deployment
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server) or listed origins/Vercel deployments
      if (!origin || allowedOrigins.has(origin) || origin.endsWith(".vercel.app")) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

// Parse incoming requests with JSON payloads
app.use(express.json());

// Base diagnostic endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// Register Crop REST routes
app.use("/api/crops", cropRoutes);

// Register User/Auth routes
app.use("/api/users", userRoutes);

// Register AI routes
app.use("/api/ai", aiRoutes);

// Register Chat routes
app.use("/api/chat", chatRoutes);

// Catch 404 and forward to error handler
app.use(notFound);

// Custom error handling middleware
app.use(errorHandler);

// Global safety process handlers for production resilience
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});
