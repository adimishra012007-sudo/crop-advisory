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
  }
};
