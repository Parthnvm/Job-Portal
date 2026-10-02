/**
 * Centralized Express Error Handling Middleware.
 * Standardizes API error shapes and prevents unhandled process crashes.
 */
export const errorHandler = (err, req, res, next) => {
  console.error(`[Error Handler] ${req.method} ${req.originalUrl}:`, err);

  // 1. Mongoose Bad ObjectId / CastError
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid resource identifier: '${err.value}' for field '${err.path}'.`,
    });
  }

  // 2. Mongoose Schema Validation Error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors || {}).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: messages,
    });
  }

  // 3. MongoDB Duplicate Key Error (Code 11000)
  if (err.code === 11000) {
    const duplicateFields = Object.keys(err.keyPattern || {});
    return res.status(409).json({
      success: false,
      message: `Duplicate record detected for field(s): ${duplicateFields.join(", ")}.`,
    });
  }

  // 4. Multer File Upload Errors
  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        success: false,
        message: "Uploaded file is too large. Maximum allowed size is 5MB.",
      });
    }
    return res.status(400).json({
      success: false,
      message: `File upload error: ${err.message}`,
    });
  }

  // 5. JWT Errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid authentication token.",
    });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Session expired. Please log in again.",
    });
  }

  // 6. Generic / Fallback Internal Error
  const statusCode = err.statusCode || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);
  return res.status(statusCode).json({
    success: false,
    message: err.message || "An unexpected internal server error occurred.",
  });
};

export default errorHandler;
