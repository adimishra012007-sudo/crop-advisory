import express from "express";
import { userController } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { dbCheck } from "../middleware/dbCheck.js";

const router = express.Router();

// Verify database connection is active
router.use(dbCheck);

router.post("/signup", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/profile", protect, userController.getUserProfile);

export default router;
