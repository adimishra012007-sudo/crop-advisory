import { crops } from "../data/crops.js";

// Crop Model helper functions
export const CropModel = {
  // Get all crops
  findAll: async () => {
    return crops;
  },

  // Get crop by id
  findById: async (id) => {
    return crops.find((crop) => crop.id === id);
  },

  // Search crops by cropName
  search: async (query) => {
    if (!query) return crops;
    const lowerQuery = query.toLowerCase();
    return crops.filter((crop) =>
      crop.cropName.toLowerCase().includes(lowerQuery)
    );
  },

  // Create new crop
  create: async (cropData) => {
    const newCrop = {
      id: String(Date.now() + Math.floor(Math.random() * 1000)), // unique ID generator
      cropName: cropData.cropName,
      soilType: cropData.soilType,
      season: cropData.season,
      waterRequirement: cropData.waterRequirement || "Not specified",
      fertilizer: cropData.fertilizer || "Not specified",
      description: cropData.description || ""
    };
    crops.push(newCrop);
    return newCrop;
  },

  // Update existing crop
  update: async (id, cropData) => {
    const cropIndex = crops.findIndex((crop) => crop.id === id);
    if (cropIndex === -1) return null;

    crops[cropIndex] = {
      ...crops[cropIndex],
      cropName: cropData.cropName !== undefined ? cropData.cropName : crops[cropIndex].cropName,
      soilType: cropData.soilType !== undefined ? cropData.soilType : crops[cropIndex].soilType,
      season: cropData.season !== undefined ? cropData.season : crops[cropIndex].season,
      waterRequirement: cropData.waterRequirement !== undefined ? cropData.waterRequirement : crops[cropIndex].waterRequirement,
      fertilizer: cropData.fertilizer !== undefined ? cropData.fertilizer : crops[cropIndex].fertilizer,
      description: cropData.description !== undefined ? cropData.description : crops[cropIndex].description
    };

    return crops[cropIndex];
  },

  // Delete crop
  delete: async (id) => {
    const cropIndex = crops.findIndex((crop) => crop.id === id);
    if (cropIndex === -1) return false;

    crops.splice(cropIndex, 1);
    return true;
  }
};
