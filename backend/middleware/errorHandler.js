// Middleware for handling 404 Not Found routes
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - URL ${req.originalUrl} does not exist`);
  res.status(404);
  next(error);
};

// Global Error Handler Middleware for formatting and returning JSON errors
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  
  // Log server errors for operational visibility
  if (statusCode >= 500) {
    console.error(`[Server Error ${statusCode}]:`, err.message || err);
  }

  res.status(statusCode).json({
    error: err.name || "Internal Server Error",
    message: err.message || "An unexpected error occurred on the server.",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
