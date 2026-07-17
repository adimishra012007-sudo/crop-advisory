import express from "express";
import { aiController } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";
import { dbCheck } from "../middleware/dbCheck.js";

const router = express.Router();

// Ensure database connection check is performed
router.use(dbCheck);

// POST /api/ai/chat
// Route protected by JWT verification middleware
router.post("/chat", protect, aiController.chatWithAI);

export default router;
