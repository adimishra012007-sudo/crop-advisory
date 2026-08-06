// API Service Client for Crops REST endpoints.
// Uses async/await with native fetch. Handles responses and bubbles up errors.

import { getToken, logout } from "./auth";

/**
 * Resolves base backend server URL from environment variables.
 * Handles cases where NEXT_PUBLIC_API_URL includes or excludes subpaths.
 */
export const getApiBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && envUrl.trim() !== "") {
    return envUrl.trim().replace(/\/api\/crops\/?$/, "").replace(/\/$/, "");
  }
  if (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
    return "https://crop-advisory-p0ng.onrender.com";
  }
  return "http://localhost:5000";
};

export const getCropsApiBase = () => `${getApiBaseUrl()}/api/crops`;

/**
 * Fetch details for logged-in user profile.
 * @returns {Promise<Object>} User profile object.
 */
export async function getUserProfile() {
  const response = await request(`${getApiBaseUrl()}/api/users/profile`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch profile (Status: ${response.status})`);
  }
  return response.json();
}

/**
 * Helper to perform fetch requests with automatic JWT attachment and 401 verification.
 */
async function request(url, options = {}) {
  const token = getToken();
  const headers = { ...options.headers };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers
    });
  } catch (netErr) {
    throw new Error("Network error. Please check if the backend server is running.");
  }

  if (response.status === 401) {
    logout();
    if (typeof window !== "undefined") {
      window.location.href = "/login?error=expired";
    }
    throw new Error("Session expired. Please login again.");
  }

  return response;
}

/**
 * Fetch all crop records from the backend API.
 * @returns {Promise<Array>} Promise resolving to the list of crops.
 */
export async function getAllCrops() {
  const response = await request(getCropsApiBase());
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch crops (Status: ${response.status})`);
  }
  return response.json();
}

/**
 * Fetch details for a single crop by ID.
 * @param {string} id - The ID of the crop.
 * @returns {Promise<Object>} Promise resolving to the crop record.
 */
export async function getCrop(id) {
  const response = await request(`${getCropsApiBase()}/${id}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch crop details (Status: ${response.status})`);
  }
  return response.json();
}

/**
 * Create a new crop record in the database.
 * @param {Object} cropData - Crop properties containing cropName, soilType, season, etc.
 * @returns {Promise<Object>} Promise resolving to the created crop record.
 */
export async function createCrop(cropData) {
  const response = await request(getCropsApiBase(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(cropData)
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const err = new Error(errorData.message || "Failed to create crop record");
    err.details = errorData.details || null;
    throw err;
  }
  return response.json();
}

/**
 * Update an existing crop record by ID.
 * @param {string} id - The ID of the crop to update.
 * @param {Object} cropData - Updated properties.
 * @returns {Promise<Object>} Promise resolving to the updated crop record.
 */
export async function updateCrop(id, cropData) {
  const response = await request(`${getCropsApiBase()}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(cropData)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const err = new Error(errorData.message || "Failed to update crop record");
    err.details = errorData.details || null;
    throw err;
  }
  return response.json();
}

/**
 * Delete a crop record by ID.
 * @param {string} id - The ID of the crop to delete.
 * @returns {Promise<boolean>} Promise resolving to true if deleted successfully.
 */
export async function deleteCrop(id) {
  const response = await request(`${getCropsApiBase()}/${id}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to delete crop (Status: ${response.status})`);
  }
  
  // DELETE on success returns 204 No Content (empty response)
  return true;
}

/**
 * Search crops by cropName using query.
 * @param {string} query - The search term.
 * @returns {Promise<Array>} Promise resolving to matching crop records.
 */
export async function searchCrop(query) {
  const response = await request(`${getCropsApiBase()}/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to search crops (Status: ${response.status})`);
  }
  return response.json();
}

/**
 * Send user chat query to backend AI endpoint.
 * Automatically handles JWT authentication and responses.
 * @param {string} message - User query message.
 * @returns {Promise<Object>} The AI response container.
 */
export async function askAIChat(message) {
  const response = await request(`${getApiBaseUrl()}/api/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to get AI response (Status: ${response.status})`);
  }
  return response.json();
}

/**
 * Save or update AI chat conversation in PostgreSQL.
 * @param {Object} chatData - Object containing title, messages array, and optional id.
 * @returns {Promise<Object>} Saved conversation.
 */
export async function saveChat(chatData) {
  const response = await request(`${getApiBaseUrl()}/api/chat/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(chatData)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to save conversation (Status: ${response.status})`);
  }

  return response.json();
}

/**
 * Fetch all saved chat conversations for the logged in user.
 * @returns {Promise<Array>} List of user conversations.
 */
export async function getChatHistory() {
  const response = await request(`${getApiBaseUrl()}/api/chat/history`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch chat history (Status: ${response.status})`);
  }

  return response.json();
}

/**
 * Fetch a single chat conversation by ID.
 * @param {string|number} id - Conversation ID.
 * @returns {Promise<Object>} Conversation detail.
 */
export async function getConversation(id) {
  const response = await request(`${getApiBaseUrl()}/api/chat/history/${id}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch conversation (Status: ${response.status})`);
  }

  return response.json();
}

/**
 * Delete a single chat conversation by ID.
 * @param {string|number} id - Conversation ID to delete.
 * @returns {Promise<boolean>} True if deleted.
 */
export async function deleteConversation(id) {
  const response = await request(`${getApiBaseUrl()}/api/chat/history/${id}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to delete conversation (Status: ${response.status})`);
  }

  return true;
}

/**
 * Rename a chat conversation title by ID.
 * @param {string|number} id - Conversation ID to rename.
 * @param {string} title - New title.
 * @returns {Promise<Object>} Updated conversation object.
 */
export async function renameConversation(id, title) {
  const response = await request(`${getApiBaseUrl()}/api/chat/history/${id}/title`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to rename conversation (Status: ${response.status})`);
  }

  return response.json();
}

/**
 * Toggle pin status of a chat conversation by ID.
 * @param {string|number} id - Conversation ID.
 * @param {boolean} isPinned - Target pin status.
 * @returns {Promise<Object>} Updated conversation object.
 */
export async function togglePinConversation(id, isPinned) {
  const response = await request(`${getApiBaseUrl()}/api/chat/history/${id}/pin`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ isPinned })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to update pin state (Status: ${response.status})`);
  }

  return response.json();
}

/**
 * Toggle favorite status of a chat conversation by ID.
 * @param {string|number} id - Conversation ID.
 * @param {boolean} isFavorite - Target favorite status.
 * @returns {Promise<Object>} Updated conversation object.
 */
export async function toggleFavoriteConversation(id, isFavorite) {
  const response = await request(`${getApiBaseUrl()}/api/chat/history/${id}/favorite`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ isFavorite })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to update favorite state (Status: ${response.status})`);
  }

  return response.json();
}

/**
 * Export a chat conversation as JSON payload by ID.
 * @param {string|number} id - Conversation ID.
 * @returns {Promise<Object>} Exported JSON payload.
 */
export async function exportConversation(id) {
  const response = await request(`${getApiBaseUrl()}/api/chat/history/${id}/export`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to export conversation (Status: ${response.status})`);
  }

  return response.json();
}

/**
 * Import a chat conversation from JSON payload.
 * @param {Object} conversationData - JSON payload containing title and messages.
 * @returns {Promise<Object>} Created conversation object.
 */
export async function importConversation(conversationData) {
  const response = await request(`${getApiBaseUrl()}/api/chat/import`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(conversationData)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to import conversation (Status: ${response.status})`);
  }

  return response.json();
}

/**
 * Fetch aggregated conversation analytics metrics for logged-in user.
 * @returns {Promise<Object>} Analytics metrics object.
 */
export async function getChatAnalytics() {
  const response = await request(`${getApiBaseUrl()}/api/chat/analytics`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch conversation analytics (Status: ${response.status})`);
  }

  return response.json();
}

