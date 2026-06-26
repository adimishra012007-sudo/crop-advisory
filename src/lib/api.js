// API Service Client for Crops REST endpoints.
// Uses async/await with native fetch. Handles responses and bubbles up errors.

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/crops";

/**
 * Fetch all crop records from the backend API.
 * @returns {Promise<Array>} Promise resolving to the list of crops.
 */
export async function getAllCrops() {
  const response = await fetch(API_BASE);
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
  const response = await fetch(`${API_BASE}/${id}`);
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
  const response = await fetch(API_BASE, {
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
  const response = await fetch(`${API_BASE}/${id}`, {
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
  const response = await fetch(`${API_BASE}/${id}`, {
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
  const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to search crops (Status: ${response.status})`);
  }
  return response.json();
}
