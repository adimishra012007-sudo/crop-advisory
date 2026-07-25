import express from "express";
import {
  saveChat,
  getChatHistory,
  getConversation,
  deleteConversation,
  renameConversation,
  togglePin,
  toggleFavorite,
  exportConversation,
  importConversation,
  getChatAnalytics
} from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";
import { dbCheck } from "../middleware/dbCheck.js";

const router = express.Router();

// Verify database connection is active for all chat operations
router.use(dbCheck);

// Protect all chat routes with JWT middleware
router.use(protect);

// Get aggregated conversation analytics for logged in user
router.get("/analytics", getChatAnalytics);

// Save or update conversation
router.post("/save", saveChat);

// Import conversation from JSON file
router.post("/import", importConversation);

// Get history of all conversations for logged in user
router.get("/history", getChatHistory);

// Export single conversation as JSON by ID
router.get("/history/:id/export", exportConversation);

// Get single conversation by ID
router.get("/history/:id", getConversation);

// Delete single conversation by ID
router.delete("/history/:id", deleteConversation);

// Rename conversation title by ID
router.patch("/history/:id/title", renameConversation);

// Toggle pin status by ID
router.patch("/history/:id/pin", togglePin);

// Toggle favorite status by ID
router.patch("/history/:id/favorite", toggleFavorite);

export default router;
