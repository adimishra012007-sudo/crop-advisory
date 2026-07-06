import pkg from "pg";
import { crops as initialCrops } from "../data/crops.js";

const { Pool } = pkg;

let pool;
let isDbConnected = false;

/**
 * Connects to the Supabase PostgreSQL database.
 */
const connectDB = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is missing from your .env configuration.");
    }

    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false, // Required for Supabase in many hosting setups
      },
    });

    // Test connection
    const client = await pool.connect();
    console.log("PostgreSQL Connected to Supabase");
    client.release();
    isDbConnected = true;

    // Run table initialization and seeding
    await initializeDatabase();
  } catch (error) {
    isDbConnected = false;
    console.error(`PostgreSQL connection failure: ${error.message}`);
    console.warn("The server will continue to run, but database operations will fail until a valid connection is established.");
  }
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
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        session_name VARCHAR(255) DEFAULT 'Session',
        messages JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
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

export default connectDB;
