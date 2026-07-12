import express from "express";
import { userController } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { dbCheck } from "../middleware/dbCheck.js";
import { authRateLimiter } from "../middleware/rateLimiter.js";
import { signupValidation, loginValidation } from "../middleware/validation.js";

const router = express.Router();

// Verify database connection is active
router.use(dbCheck);

router.post("/signup", authRateLimiter, signupValidation, userController.registerUser);
router.post("/login", authRateLimiter, loginValidation, userController.loginUser);
router.get("/profile", protect, userController.getUserProfile);

// Google OAuth routes
router.get("/google", userController.googleAuth);
router.get("/google/callback", userController.googleCallback);

export default router;
