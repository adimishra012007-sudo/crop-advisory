import { getGeminiChatResponse } from "../services/geminiService.js";

/**
 * Controller to handle AI Chat interactions.
 * Performs validation, routes requests to the geminiService, and formats errors.
 */
export const aiController = {
  /**
   * POST /api/ai/chat
   * Process agricultural queries from users and returns the AI advisor response.
   */
  chatWithAI: async (req, res, next) => {
    try {
      const { message } = req.body;

      // 1. Validate request payload
      if (message === undefined) {
        return res.status(400).json({
          error: "Validation Error",
          message: "Request body must contain a 'message' field."
        });
      }

      if (typeof message !== "string" || message.trim() === "") {
        return res.status(400).json({
          error: "Validation Error",
          message: "The 'message' field must be a non-empty string."
        });
      }

      // 2. Query Google Gemini AI service
      const response = await getGeminiChatResponse(message.trim());

      // 3. Return response JSON matching user spec
      return res.status(200).json({
        response
      });
      
    } catch (error) {
      console.error("aiController caught error:", error.message);
      
      // Determine HTTP status and error label
      const statusCode = error.statusCode || 500;
      const errorLabel = statusCode === 400 ? "Bad Request" 
                         : statusCode === 401 ? "Unauthorized"
                         : statusCode === 429 ? "Too Many Requests"
                         : statusCode === 503 ? "Service Unavailable"
                         : statusCode === 504 ? "Gateway Timeout"
                         : "Internal Server Error";

      return res.status(statusCode).json({
        error: errorLabel,
        message: error.message || "An unexpected error occurred while communicating with the AI Crop Advisor."
      });
    }
  }
};
