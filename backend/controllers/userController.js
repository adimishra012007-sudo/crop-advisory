import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/userModel.js";

/**
 * Generates a signed JWT token for the user.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_jwt_secret_uttarakhand_2026", {
    expiresIn: "30d",
  });
};

/**
 * Helper to dynamically determine the exact Google OAuth callback URL.
 * Strongly enforces production URL when in production environment to prevent mismatches.
 */
const getGoogleCallbackUrl = (req) => {
  if (process.env.NODE_ENV === "production") {
    return "https://crop-advisory-p0ng.onrender.com/api/users/google/callback";
  }
  if (process.env.GOOGLE_CALLBACK_URL && process.env.GOOGLE_CALLBACK_URL.trim() !== "") {
    return process.env.GOOGLE_CALLBACK_URL.trim();
  }
  const protocol = req.headers["x-forwarded-proto"] || req.protocol || "http";
  const host = req.get("host") || "localhost:5000";
  return `${protocol}://${host}/api/users/google/callback`;
};

/**
 * Helper to dynamically determine the frontend redirect URL after OAuth.
 * Strongly enforces production Vercel URL when in production environment.
 */
const getClientRedirectUrl = (req) => {
  if (process.env.NODE_ENV === "production") {
    return "https://crop-advisory-tau.vercel.app/login";
  }
  let baseUrl = "";
  if (process.env.CLIENT_REDIRECT_URL && process.env.CLIENT_REDIRECT_URL.trim() !== "") {
    baseUrl = process.env.CLIENT_REDIRECT_URL.trim();
  } else {
    const origin = req.get("origin") || req.get("referer");
    if (origin) {
      try {
        const parsed = new URL(origin);
        baseUrl = parsed.origin;
      } catch {}
    }
  }
  if (!baseUrl) {
    baseUrl = "http://localhost:3000";
  }
  if (!baseUrl.endsWith("/login")) {
    baseUrl = baseUrl.replace(/\/$/, "") + "/login";
  }
  return baseUrl;
};

export const userController = {
  // POST /api/users/signup
  registerUser: async (req, res, next) => {
    try {
      const { name, email, password, role, location, phone } = req.body;

      // 1. Validation
      const errors = {};
      if (!name || String(name).trim() === "") {
        errors.name = "Name is required.";
      }
      if (!email || String(email).trim() === "") {
        errors.email = "Email is required.";
      }
      if (!password || String(password).length < 6) {
        errors.password = "Password must be at least 6 characters long.";
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({
          error: "Validation Error",
          details: errors
        });
      }

      // 2. Check if user already exists
      const userExists = await UserModel.findByEmail(email);
      if (userExists) {
        return res.status(400).json({
          error: "Bad Request",
          message: "User with this email already exists."
        });
      }

      // 3. Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // 4. Create user
      const user = await UserModel.create({
        name,
        email,
        password: hashedPassword,
        role,
        location,
        phone
      });

      // 5. Generate token & response
      const token = generateToken(user.id);

      return res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        phone: user.phone,
        token
      });
    } catch (error) {
      return next(error);
    }
  },

  // POST /api/users/login
  loginUser: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // 1. Validation
      const errors = {};
      if (!email || String(email).trim() === "") {
        errors.email = "Email is required.";
      }
      if (!password || String(password).trim() === "") {
        errors.password = "Password is required.";
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({
          error: "Validation Error",
          details: errors
        });
      }

      // 2. Find user
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          error: "Unauthorized",
          message: "Invalid email or password."
        });
      }

      // 3. Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          error: "Unauthorized",
          message: "Invalid email or password."
        });
      }

      // 4. Return token & response
      const token = generateToken(user.id);

      return res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        phone: user.phone,
        token
      });
    } catch (error) {
      return next(error);
    }
  },

  // GET /api/users/profile
  getUserProfile: async (req, res, next) => {
    try {
      // req.user is populated by protect middleware
      return res.status(200).json(req.user);
    } catch (error) {
      return next(error);
    }
  },

  // GET /api/users/google
  googleAuth: (req, res) => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const callbackUrl = getGoogleCallbackUrl(req);
    
    if (!clientId) {
      console.error("GOOGLE_CLIENT_ID is not configured in environment variables.");
      return res.status(500).send("Google OAuth is not configured on this server. Please set GOOGLE_CLIENT_ID in environment variables.");
    }

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(callbackUrl)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent("profile email")}` +
      `&prompt=select_account`;
      
    res.redirect(googleAuthUrl);
  },

  // GET /api/users/google/callback
  googleCallback: async (req, res, next) => {
    const redirectUrl = getClientRedirectUrl(req);
    const appendParam = (url, key, val) => {
      const sep = url.includes("?") ? "&" : "?";
      return `${url}${sep}${key}=${encodeURIComponent(val)}`;
    };

    try {
      const { code } = req.query;
      
      if (!code) {
        return res.redirect(appendParam(redirectUrl, "error", "cancelled"));
      }

      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      const callbackUrl = getGoogleCallbackUrl(req);

      console.log(`[OAuth Debug] Expected redirect_uri: ${callbackUrl}`);
      console.log(`[OAuth Debug] Client ID configured: ${!!clientId}`);
      console.log(`[OAuth Debug] Client Secret configured: ${!!clientSecret}`);

      if (!clientId || !clientSecret) {
        console.error("Google OAuth credentials are not fully configured in environment variables.");
        return res.redirect(appendParam(redirectUrl, "error", "oauth_config_missing"));
      }

      // Exchange code for tokens
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code: String(code),
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: callbackUrl,
          grant_type: "authorization_code",
        }).toString(),
      });

      if (!tokenResponse.ok) {
        const errText = await tokenResponse.text();
        console.error("Google Token Exchange failed:", errText);
        return res.redirect(appendParam(redirectUrl, "error", "token_exchange_failed"));
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      // Fetch user profile from Google
      const profileResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!profileResponse.ok) {
        const errText = await profileResponse.text();
        console.error("Google Profile fetch failed:", errText);
        return res.redirect(appendParam(redirectUrl, "error", "profile_fetch_failed"));
      }

      const profile = await profileResponse.json();
      const email = profile.email;
      const name = profile.name || email.split("@")[0];

      if (!email) {
        return res.redirect(appendParam(redirectUrl, "error", "email_not_provided"));
      }

      // Find or create user
      let user = await UserModel.findByEmail(email);

      if (!user) {
        // Generate a random secure password for the new user
        const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(randomPassword, salt);

        user = await UserModel.create({
          name,
          email,
          password: hashedPassword,
          role: "farmer", // Default role
          location: { district: "", state: "Uttarakhand" },
          phone: ""
        });
      }

      // Generate JWT
      const token = generateToken(user.id);

      // Return the token safely via redirection query param
      return res.redirect(appendParam(redirectUrl, "token", token));
    } catch (error) {
      console.error("Google OAuth error:", error);
      return res.redirect(appendParam(redirectUrl, "error", "server_error"));
    }
  }
};
