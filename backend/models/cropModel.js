import { query } from "../config/db.js";

// Crop Model helper functions using PostgreSQL Pool connection
export const CropModel = {
  // Get all crops
  findAll: async () => {
    const res = await query(
      `SELECT id, crop_name AS "cropName", soil_type AS "soilType", season, 
              water_requirement AS "waterRequirement", fertilizer, description 
       FROM crops ORDER BY id ASC`
    );
    // Convert ID to string for frontend consistency
    return res.rows.map(row => ({ ...row, id: String(row.id) }));
  },

  // Get crop by id
  findById: async (id) => {
    const intId = parseInt(id, 10);
    if (isNaN(intId)) {
      return null;
    }
    const res = await query(
      `SELECT id, crop_name AS "cropName", soil_type AS "soilType", season, 
              water_requirement AS "waterRequirement", fertilizer, description 
       FROM crops WHERE id = $1`,
      [intId]
    );
    if (res.rows.length === 0) {
      return null;
    }
    return { ...res.rows[0], id: String(res.rows[0].id) };
  },

  // Search crops by cropName (case-insensitive substring matching)
  search: async (q) => {
    if (!q) {
      return await CropModel.findAll();
    }
    const res = await query(
      `SELECT id, crop_name AS "cropName", soil_type AS "soilType", season, 
              water_requirement AS "waterRequirement", fertilizer, description 
       FROM crops 
       WHERE crop_name ILIKE $1 
       ORDER BY id ASC`,
      [`%${q}%`]
    );
    return res.rows.map(row => ({ ...row, id: String(row.id) }));
  },

  // Create new crop
  create: async (cropData) => {
    const { cropName, soilType, season, waterRequirement, fertilizer, description } = cropData;
    const res = await query(
      `INSERT INTO crops (crop_name, soil_type, season, water_requirement, fertilizer, description)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, crop_name AS "cropName", soil_type AS "soilType", season, 
                 water_requirement AS "waterRequirement", fertilizer, description`,
      [
        cropName,
        soilType,
        season,
        waterRequirement || 'Not specified',
        fertilizer || 'Not specified',
        description || ''
      ]
    );
    return { ...res.rows[0], id: String(res.rows[0].id) };
  },

  // Update existing crop
  update: async (id, cropData) => {
    const intId = parseInt(id, 10);
    if (isNaN(intId)) {
      return null;
    }

    const current = await CropModel.findById(id);
    if (!current) {
      return null;
    }

    // Merge/fallback fields
    const updatedName = cropData.cropName !== undefined ? cropData.cropName : current.cropName;
    const updatedSoil = cropData.soilType !== undefined ? cropData.soilType : current.soilType;
    const updatedSeason = cropData.season !== undefined ? cropData.season : current.season;
    const updatedWater = cropData.waterRequirement !== undefined ? cropData.waterRequirement : current.waterRequirement;
    const updatedFertilizer = cropData.fertilizer !== undefined ? cropData.fertilizer : current.fertilizer;
    const updatedDesc = cropData.description !== undefined ? cropData.description : current.description;

    const res = await query(
      `UPDATE crops 
       SET crop_name = $1, soil_type = $2, season = $3, water_requirement = $4, fertilizer = $5, description = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING id, crop_name AS "cropName", soil_type AS "soilType", season, 
                 water_requirement AS "waterRequirement", fertilizer, description`,
      [updatedName, updatedSoil, updatedSeason, updatedWater, updatedFertilizer, updatedDesc, intId]
    );
    if (res.rows.length === 0) {
      return null;
    }
    return { ...res.rows[0], id: String(res.rows[0].id) };
  },

  // Delete crop
  delete: async (id) => {
    const intId = parseInt(id, 10);
    if (isNaN(intId)) {
      return false;
    }
    const res = await query(`DELETE FROM crops WHERE id = $1 RETURNING id`, [intId]);
    return res.rows.length > 0;
  }
};
