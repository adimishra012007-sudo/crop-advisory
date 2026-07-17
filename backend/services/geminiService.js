import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are a professional agricultural expert and advisor specializing in Indian agriculture, with deep expertise in Uttarakhand's unique farming conditions (terrace farming, sloped fields, soil types, organic farming, and regional crop specializations like Mandua (finger millet), apples, kidney beans (Rajma), etc.).
Your primary objective is to assist farmers and agro-entrepreneurs with accurate, practical, and localized advice.

Follow these strict behavior guidelines:
1. FOCUS AREAS: Answer questions related only to:
   - Crop recommendations and season selection (Kharif, Rabi, Zaid)
   - Soil analysis (sandy, clayey, loamy, acidic hill soils) and management
   - Fertilizer and organic manure recommendations (e.g., Jivamrit, Bijamrit, vermicompost)
   - Pest control and disease diagnosis (text-based)
   - Irrigation and water management (sloped contouring, rainfed farming, drip irrigation)
   - Indian government agriculture schemes
   - Uttarakhand farming practices and crops (specifically Mandua, Jhangora, Gahat, Apples, etc.)
2. STRICT AGRI CONSTRAINT: If the user asks any question that is not related to agriculture, farming, crops, soils, weather/water for crops, pests, or agricultural policy, you must politely refuse to answer. Use a response like:
   'Namaskar! I am your AI Crop Advisor specializing in agriculture and farming-related topics. I can help you with crop advice, soil management, pests, organic manure, and regional farming guidelines. Please ask me a farming or crop-related question!'
3. TONE & FORMATting: Keep the response professional, encouraging, and clear. Use bullet points and bold headers to make the text easy to read for farmers. Reference local terms where appropriate.`;

/**
 * Communicates with the Google Gemini API using the Generative AI Node.js SDK.
 * Implements timeout protection, system instructions, and maps downstream network/quota errors.
 * 
 * @param {string} userMessage - The query from the user.
 * @returns {Promise<string>} The parsed text response from Gemini.
 */
export const getGeminiChatResponse = async (userMessage) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    const err = new Error("Gemini API key is not configured on the server. Please add GEMINI_API_KEY in the backend .env file.");
    err.statusCode = 500;
    throw err;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    // Using stable, active gemini-3.1-flash-lite model
    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite",
      systemInstruction: SYSTEM_PROMPT,
    });

    // 15 seconds timeout using Promise.race
    const apiCall = model.generateContent({
      contents: [{ role: "user", parts: [{ text: userMessage }] }]
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => {
        const timeoutErr = new Error("Gemini API request timed out after 15 seconds.");
        timeoutErr.statusCode = 504;
        reject(timeoutErr);
      }, 15000)
    );

    const result = await Promise.race([apiCall, timeoutPromise]);

    if (!result || !result.response) {
      const emptyErr = new Error("Invalid or empty response structure from Gemini API.");
      emptyErr.statusCode = 502;
      throw emptyErr;
    }

    const responseText = result.response.text();
    if (!responseText || responseText.trim() === "") {
      const emptyErr = new Error("Received an empty response text from Gemini API.");
      emptyErr.statusCode = 502;
      throw emptyErr;
    }

    return responseText;
  } catch (error) {
    console.error("Gemini Service Error:", error);

    // Propagate already formatted custom errors
    if (error.statusCode) {
      throw error;
    }

    // Map known API error conditions
    const errorMsg = error.message ? error.message.toLowerCase() : "";
    let statusCode = 500;
    let userFriendlyMessage = error.message || "An error occurred while contacting the Gemini API.";

    if (errorMsg.includes("429") || errorMsg.includes("quota")) {
      statusCode = 429;
      userFriendlyMessage = "Gemini API daily quota exceeded or rate limit hit. Please try again in a few minutes.";
    } else if (errorMsg.includes("api key") || errorMsg.includes("key not found") || errorMsg.includes("invalid key") || errorMsg.includes("400")) {
      statusCode = 400;
      userFriendlyMessage = "The Gemini API request failed. This could be due to an invalid API key or malformed request format.";
    } else if (errorMsg.includes("enotfound") || errorMsg.includes("fetch failed") || errorMsg.includes("econnrefused")) {
      statusCode = 503;
      userFriendlyMessage = "API unavailable. The server failed to connect to Gemini due to a network connection issue.";
    }

    const mappedError = new Error(userFriendlyMessage);
    mappedError.statusCode = statusCode;
    mappedError.originalError = error;
    throw mappedError;
  }
};
