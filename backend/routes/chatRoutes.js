import express from "express";
import {
  saveChat,
  getChatHistory,
  getConversation,
  deleteConversation,
  renameConversation
} from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";
import { dbCheck } from "../middleware/dbCheck.js";

const router = express.Router();

// Verify database connection is active for all chat operations
router.use(dbCheck);

// Protect all chat routes with JWT middleware
router.use(protect);

// Save or update conversation
router.post("/save", saveChat);

// Get history of all conversations for logged in user
router.get("/history", getChatHistory);

// Get single conversation by ID
router.get("/history/:id", getConversation);

// Delete single conversation by ID
router.delete("/history/:id", deleteConversation);

// Rename conversation title by ID
router.patch("/history/:id/title", renameConversation);

export default router;
