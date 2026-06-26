import { CropModel } from "../models/cropModel.js";

// Controller actions for Crop API
export const cropController = {
  // GET /api/crops
  getAllCrops: async (req, res, next) => {
    try {
      const crops = await CropModel.findAll();
      return res.status(200).json(crops);
    } catch (error) {
      return next(error);
    }
  },

  // GET /api/crops/:id
  getCropById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const crop = await CropModel.findById(id);
      if (!crop) {
        return res.status(404).json({
          error: "Not Found",
          message: `Crop with ID ${id} was not found.`
        });
      }
      return res.status(200).json(crop);
    } catch (error) {
      return next(error);
    }
  },

  // GET /api/crops/search?q=
  searchCrops: async (req, res, next) => {
    try {
      const query = req.query.q;
      // If q query parameter is missing, return 400 Bad Request
      if (query === undefined) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Query parameter 'q' is required for search. Example: /api/crops/search?q=apple"
        });
      }
      const results = await CropModel.search(String(query));
      return res.status(200).json(results);
    } catch (error) {
      return next(error);
    }
  },

  // POST /api/crops
  createCrop: async (req, res, next) => {
    try {
      const { cropName, soilType, season, waterRequirement, fertilizer, description } = req.body;
      
      // Perform required fields validation
      const errors = {};
      if (!cropName || String(cropName).trim() === "") {
        errors.cropName = "Crop name is required.";
      }
      if (!soilType || String(soilType).trim() === "") {
        errors.soilType = "Soil type is required.";
      }
      if (!season || String(season).trim() === "") {
        errors.season = "Season is required.";
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({
          error: "Validation Error",
          details: errors
        });
      }

      const newCrop = await CropModel.create({
        cropName,
        soilType,
        season,
        waterRequirement,
        fertilizer,
        description
      });

      return res.status(201).json(newCrop);
    } catch (error) {
      return next(error);
    }
  },

  // PUT /api/crops/:id
  updateCrop: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { cropName, soilType, season, waterRequirement, fertilizer, description } = req.body;

      // First check if crop exists
      const existingCrop = await CropModel.findById(id);
      if (!existingCrop) {
        return res.status(404).json({
          error: "Not Found",
          message: `Crop with ID ${id} was not found.`
        });
      }

      // Perform validation for required fields on update
      const errors = {};
      if (cropName !== undefined && String(cropName).trim() === "") {
        errors.cropName = "Crop name cannot be empty.";
      }
      if (soilType !== undefined && String(soilType).trim() === "") {
        errors.soilType = "Soil type cannot be empty.";
      }
      if (season !== undefined && String(season).trim() === "") {
        errors.season = "Season cannot be empty.";
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({
          error: "Validation Error",
          details: errors
        });
      }

      const updatedCrop = await CropModel.update(id, {
        cropName,
        soilType,
        season,
        waterRequirement,
        fertilizer,
        description
      });

      return res.status(200).json(updatedCrop);
    } catch (error) {
      return next(error);
    }
  },

  // DELETE /api/crops/:id
  deleteCrop: async (req, res, next) => {
    try {
      const { id } = req.params;
      const success = await CropModel.delete(id);
      if (!success) {
        return res.status(404).json({
          error: "Not Found",
          message: `Crop with ID ${id} was not found.`
        });
      }
      // Return 204 No Content
      return res.status(204).end();
    } catch (error) {
      return next(error);
    }
  }
};
