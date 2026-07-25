import { ChatHistoryModel } from "../models/chatHistoryModel.js";

/**
 * @desc    Save or update an AI chat conversation
 * @route   POST /api/chat/save
 * @access  Private (JWT Protected)
 */
export const saveChat = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id, title, messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Messages array is required."
      });
    }

    const conversationTitle = title || (messages[0]?.content ? messages[0].content.substring(0, 30) + "..." : "AI Advisory Chat");

    let savedConversation;

    if (id) {
      // Attempt to update existing conversation
      savedConversation = await ChatHistoryModel.update(id, userId, {
        title: conversationTitle,
        messages
      });

      // If not found, create new
      if (!savedConversation) {
        savedConversation = await ChatHistoryModel.create({
          userId,
          title: conversationTitle,
          messages
        });
      }
    } else {
      // Create new conversation
      savedConversation = await ChatHistoryModel.create({
        userId,
        title: conversationTitle,
        messages
      });
    }

    return res.status(200).json({
      success: true,
      conversation: savedConversation,
      ...savedConversation
    });
  } catch (error) {
    console.error("Error saving chat conversation:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to save conversation."
    });
  }
};

/**
 * @desc    Get all chat conversations for logged-in user (newest first)
 * @route   GET /api/chat/history
 * @access  Private (JWT Protected)
 */
export const getChatHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const conversations = await ChatHistoryModel.findByUserId(userId);

    return res.status(200).json(conversations);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to retrieve chat history."
    });
  }
};

/**
 * @desc    Get single chat conversation by ID
 * @route   GET /api/chat/history/:id
 * @access  Private (JWT Protected)
 */
export const getConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const conversation = await ChatHistoryModel.findById(id, userId);

    if (!conversation) {
      return res.status(404).json({
        error: "Not Found",
        message: "Conversation not found."
      });
    }

    return res.status(200).json(conversation);
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to retrieve conversation."
    });
  }
};

/**
 * @desc    Delete single chat conversation by ID
 * @route   DELETE /api/chat/history/:id
 * @access  Private (JWT Protected)
 */
export const deleteConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await ChatHistoryModel.delete(id, userId);

    if (!deleted) {
      return res.status(404).json({
        error: "Not Found",
        message: "Conversation not found or access denied."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Conversation deleted successfully."
    });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to delete conversation."
    });
  }
};
