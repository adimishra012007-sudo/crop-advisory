// Middleware for handling 404 Not Found routes
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - URL ${req.originalUrl} does not exist`);
  res.status(404);
  next(error);
};

// Global Error Handler Middleware for formatting and returning JSON errors
export const errorHandler = (err, req, res, next) => {
  // If the status code is still 200, default to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    error: err.name || "Internal Server Error",
    message: err.message || "An unexpected error occurred on the server.",
  });
};
