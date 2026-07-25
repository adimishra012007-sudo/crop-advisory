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

/**
 * @desc    Rename single chat conversation title by ID
 * @route   PATCH /api/chat/history/:id/title
 * @access  Private (JWT Protected)
 */
export const renameConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { title } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        error: "Bad Request",
        message: "A valid title string is required."
      });
    }

    const updated = await ChatHistoryModel.update(id, userId, {
      title: title.trim()
    });

    if (!updated) {
      return res.status(404).json({
        error: "Not Found",
        message: "Conversation not found or access denied."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Conversation title updated successfully.",
      conversation: updated
    });
  } catch (error) {
    console.error("Error renaming conversation:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to rename conversation."
    });
  }
};

/**
 * @desc    Pin or unpin a chat conversation by ID
 * @route   PATCH /api/chat/history/:id/pin
 * @access  Private (JWT Protected)
 */
export const togglePin = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { isPinned, is_pinned } = req.body;

    const targetPinnedState = isPinned !== undefined ? Boolean(isPinned) : (is_pinned !== undefined ? Boolean(is_pinned) : true);

    const updated = await ChatHistoryModel.togglePin(id, userId, targetPinnedState);

    if (!updated) {
      return res.status(404).json({
        error: "Not Found",
        message: "Conversation not found or access denied."
      });
    }

    return res.status(200).json({
      success: true,
      message: `Conversation ${targetPinnedState ? "pinned" : "unpinned"} successfully.`,
      conversation: updated
    });
  } catch (error) {
    console.error("Error toggling conversation pin state:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to update pin state."
    });
  }
};

/**
 * @desc    Favorite or unfavorite a chat conversation by ID
 * @route   PATCH /api/chat/history/:id/favorite
 * @access  Private (JWT Protected)
 */
export const toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { isFavorite, is_favorite } = req.body;

    const targetFavoriteState = isFavorite !== undefined ? Boolean(isFavorite) : (is_favorite !== undefined ? Boolean(is_favorite) : true);

    const updated = await ChatHistoryModel.toggleFavorite(id, userId, targetFavoriteState);

    if (!updated) {
      return res.status(404).json({
        error: "Not Found",
        message: "Conversation not found or access denied."
      });
    }

    return res.status(200).json({
      success: true,
      message: `Conversation ${targetFavoriteState ? "marked as favorite" : "unfavorited"} successfully.`,
      conversation: updated
    });
  } catch (error) {
    console.error("Error toggling conversation favorite state:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to update favorite state."
    });
  }
};
