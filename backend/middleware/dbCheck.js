import { getDbStatus } from "../config/db.js";

/**
 * Middleware that checks if the PostgreSQL connection is fully established.
 * If the connection is down, it returns a 503 Service Unavailable error to the client.
 */
export const dbCheck = (req, res, next) => {
  if (!getDbStatus()) {
    return res.status(503).json({
      error: "Service Unavailable",
      message: "Database connection is not active. Please check the backend .env configuration and Supabase status."
    });
  }
  next();
};
