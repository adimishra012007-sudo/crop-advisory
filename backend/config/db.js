import pkg from "pg";
import { crops as initialCrops } from "../data/crops.js";

const { Pool } = pkg;

let pool;
let isDbConnected = false;
let lastDbError = null;

/**
 * Connects to the Supabase PostgreSQL database with robust configuration and retry logic.
 */
const connectDB = async () => {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL environment variable is missing from your .env configuration.");
    return;
  }

  // Supabase Pooler (port 6543) requires explicit SSL handling in pg
  const isSupabase = process.env.DATABASE_URL.includes("supabase.com") || process.env.DATABASE_URL.includes("supabase.co");
  
  const poolConfig = {
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    max: 10,
  };

  if (process.env.NODE_ENV === "production" || isSupabase) {
    poolConfig.ssl = { rejectUnauthorized: false };
  }

  pool = new Pool(poolConfig);

  pool.on("error", (err) => {
    console.error("Unexpected error on idle client", err);
    isDbConnected = false;
  });

  const connectWithRetry = async (retries = 5, delay = 5000) => {
    try {
      const client = await pool.connect();
      console.log("PostgreSQL Connected to Supabase");
      client.release();
      isDbConnected = true;

      // Run table initialization and seeding
      await initializeDatabase();
    } catch (error) {
      isDbConnected = false;
      lastDbError = error.message;
      const sanitizedMsg = String(error.message || "").replace(/:\/\/[^:]+:[^@]+@/, "://***:***@");
      console.error(`PostgreSQL connection failure: ${sanitizedMsg}`);
      
      if (retries > 0) {
        console.log(`Retrying database connection in ${delay / 1000} seconds... (${retries} attempts left)`);
        setTimeout(() => connectWithRetry(retries - 1, delay), delay);
      } else {
        console.warn("Max retries reached. The server will continue to run, but database operations will fail until a valid connection is established.");
      }
    }
  };

  await connectWithRetry();
};

/**
 * Initializes tables if they do not exist and seeds initial crops.
 */
const initializeDatabase = async () => {
  try {
    // 1. Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'farmer',
        location JSONB DEFAULT '{"district": "", "state": "Uttarakhand"}'::jsonb,
        phone VARCHAR(50) DEFAULT '',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Create crops table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS crops (
        id SERIAL PRIMARY KEY,
        crop_name VARCHAR(255) NOT NULL,
        soil_type VARCHAR(255) NOT NULL,
        season VARCHAR(255) NOT NULL,
        water_requirement VARCHAR(255) DEFAULT 'Not specified',
        fertilizer VARCHAR(255) DEFAULT 'Not specified',
        description TEXT DEFAULT '',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. Create chat_history table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS chat_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) DEFAULT 'Conversation',
        session_name VARCHAR(255) DEFAULT 'Session',
        messages JSONB DEFAULT '[]'::jsonb,
        is_pinned BOOLEAN DEFAULT FALSE,
        is_favorite BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Migration helper: Ensure columns exist if table was previously created without them
    await pool.query(`
      ALTER TABLE chat_history ADD COLUMN IF NOT EXISTS title VARCHAR(255) DEFAULT 'Conversation';
      ALTER TABLE chat_history ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT FALSE;
      ALTER TABLE chat_history ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT FALSE;
    `);

    console.log("Database tables verified/created successfully.");

    // Seed the crops table if empty
    const res = await pool.query("SELECT COUNT(*) FROM crops");
    const count = parseInt(res.rows[0].count, 10);
    if (count === 0) {
      console.log("PostgreSQL 'crops' table is empty. Seeding initial crop data...");
      for (const crop of initialCrops) {
        await pool.query(
          `INSERT INTO crops (crop_name, soil_type, season, water_requirement, fertilizer, description)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            crop.cropName,
            crop.soilType,
            crop.season,
            crop.waterRequirement || "Not specified",
            crop.fertilizer || "Not specified",
            crop.description || ""
          ]
        );
      }
      console.log(`Successfully seeded ${initialCrops.length} initial crop records.`);
    } else {
      console.log(`PostgreSQL 'crops' table already contains ${count} records. Skipping seeding.`);
    }
  } catch (err) {
    console.error("Error during database initialization/seeding:", err);
  }
};

export const query = (text, params) => {
  if (!pool) {
    throw new Error("Database pool is not initialized. Check connection status.");
  }
  return pool.query(text, params);
};

export const getDbStatus = () => {
  return isDbConnected;
};

export const getLastDbError = () => {
  return lastDbError;
};

export default connectDB;
