import jwt from "jsonwebtoken";
import { UserModel } from "../models/userModel.js";

/**
 * Middleware to protect routes with JWT Bearer authentication.
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_jwt_secret_uttarakhand_2026");

      // Get user from the database
      const user = await UserModel.findById(decoded.id);
      
      if (!user) {
        return res.status(401).json({
          error: "Not Authorized",
          message: "User associated with this token no longer exists."
        });
      }

      // Attach user to request (excluding password)
      delete user.password;
      req.user = user;
      next();
    } catch (error) {
      console.error("JWT Verification error:", error.message);
      return res.status(401).json({
        error: "Not Authorized",
        message: "Not authorized, token failed or expired."
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      error: "Not Authorized",
      message: "Not authorized, no token provided."
    });
  }
};
