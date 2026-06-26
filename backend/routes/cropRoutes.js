import express from "express";
import { cropController } from "../controllers/cropController.js";

const router = express.Router();

// Define routes in order. Note: '/search' must come BEFORE '/:id'
router.get("/search", cropController.searchCrops);
router.get("/", cropController.getAllCrops);
router.get("/:id", cropController.getCropById);
router.post("/", cropController.createCrop);
router.put("/:id", cropController.updateCrop);
router.delete("/:id", cropController.deleteCrop);

export default router;
