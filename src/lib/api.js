// API Service Client for Crops REST endpoints.
// Uses async/await with native fetch. Handles responses and bubbles up errors.

import { getToken, logout } from "./auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/crops";

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
  const response = await request(API_BASE);
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
  const response = await request(`${API_BASE}/${id}`);
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
  const response = await request(API_BASE, {
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
  const response = await request(`${API_BASE}/${id}`, {
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
  const response = await request(`${API_BASE}/${id}`, {
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
  const response = await request(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
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
  // Extract base backend url by replacing '/api/crops'
  const backendBase = process.env.NEXT_PUBLIC_API_URL 
    ? process.env.NEXT_PUBLIC_API_URL.replace("/api/crops", "") 
    : "http://localhost:5000";

  const response = await request(`${backendBase}/api/ai/chat`, {
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

