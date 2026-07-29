// Helper to get base API URL from environment variables
const getApiBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!envUrl) return "http://localhost:5000";
  return envUrl.replace(/\/api\/crops\/?$/, "").replace(/\/$/, "");
};

const getAuthApiBase = () => `${getApiBaseUrl()}/api/users`;

/**
 * Perform login request to the backend.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>} The authenticated user data with JWT token.
 */
export async function login(email, password) {
  let response;
  try {
    response = await fetch(`${getAuthApiBase()}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });
  } catch (netErr) {
    throw new Error("Network error. Please check if the backend server is running.");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const err = new Error(errorData.message || "Failed to log in.");
    err.details = errorData.details || null;
    throw err;
  }

  const data = await response.json();
  
  // Persist session
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("authUser", JSON.stringify({
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      location: data.location,
      phone: data.phone
    }));
    // Dispatch event to notify navbar/other listeners
    window.dispatchEvent(new Event("auth-change"));
  }

  return data;
}

/**
 * Register a new user in the database.
 * @param {Object} userData - Contains name, email, password, role, location, phone.
 * @returns {Promise<Object>} Registered user details with JWT token.
 */
export async function signup(userData) {
  let response;
  try {
    response = await fetch(`${getAuthApiBase()}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    });
  } catch (netErr) {
    throw new Error("Network error. Please check if the backend server is running.");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const err = new Error(errorData.message || "Failed to register user.");
    err.details = errorData.details || null;
    throw err;
  }

  const data = await response.json();

  // Automatically log in the user upon registration
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("authUser", JSON.stringify({
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      location: data.location,
      phone: data.phone
    }));
    window.dispatchEvent(new Event("auth-change"));
  }

  return data;
}

/**
 * Clear the auth session and notify the app.
 */
export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    window.dispatchEvent(new Event("auth-change"));
  }
}

/**
 * Get JWT token from storage.
 */
export function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
}

/**
 * Get active user metadata from storage.
 */
export function getUser() {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("authUser");
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Helper to check if a user session is active.
 */
export function isAuthenticated() {
  return !!getToken();
}
