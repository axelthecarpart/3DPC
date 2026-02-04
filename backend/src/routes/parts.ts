import { Router } from "express";
import {
  getCPUs,
  getGPUs,
  getRAM,
  getStorage,
  getCases,
  getPartsByType,
  addPartByType,
} from "../controllers/partsController";

const router = Router();

// Specific routes first
router.get("/cpus", getCPUs);
router.get("/gpus", getGPUs);
router.get("/ram", getRAM);
router.get("/storage", getStorage);
router.get("/cases", getCases);

// Generic routes
router.get("/pc-parts/:type", getPartsByType);
router.post("/pc-parts/:type", addPartByType);

export default router;
