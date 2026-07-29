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
    const callbackUrl = process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/users/google/callback";
    
    if (!clientId) {
      console.error("GOOGLE_CLIENT_ID is not configured in .env");
      return res.status(500).send("Google OAuth is not configured on this server. Please set GOOGLE_CLIENT_ID in your backend .env file.");
    }

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(callbackUrl)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent("profile email")}` +
      `&prompt=select_account`;
      
    res.redirect(googleAuthUrl);
  },

  // GET /api/users/google/callback
  googleCallback: async (req, res, next) => {
    try {
      const { code } = req.query;
      const redirectUrl = process.env.CLIENT_REDIRECT_URL || "http://localhost:3000/login";
      
      if (!code) {
        return res.redirect(`${redirectUrl}?error=cancelled`);
      }

      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      const callbackUrl = process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/users/google/callback";

      if (!clientId || !clientSecret) {
        console.error("Google OAuth credentials are not fully configured in .env");
        return res.redirect(`${redirectUrl}?error=oauth_config_missing`);
      }

      // Exchange code for tokens
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: callbackUrl,
          grant_type: "authorization_code",
        }).toString(),
      });

      if (!tokenResponse.ok) {
        const errText = await tokenResponse.text();
        console.error("Google Token Exchange failed:", errText);
        return res.redirect(`${redirectUrl}?error=token_exchange_failed`);
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
        return res.redirect(`${redirectUrl}?error=profile_fetch_failed`);
      }

      const profile = await profileResponse.json();
      const email = profile.email;
      const name = profile.name || email.split("@")[0];

      if (!email) {
        return res.redirect(`${redirectUrl}?error=email_not_provided`);
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
      return res.redirect(`${redirectUrl}?token=${token}`);
    } catch (error) {
      console.error("Google OAuth error:", error);
      const redirectUrl = process.env.CLIENT_REDIRECT_URL || "http://localhost:3000/login";
      return res.redirect(`${redirectUrl}?error=server_error`);
    }
  }
};
