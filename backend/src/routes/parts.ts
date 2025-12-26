import { Router } from "express";
import { getPartsByType } from "../controllers/partsController";

const router = Router();

router.get("/:type", getPartsByType); // /parts/cpu, /parts/gpu, etc.

export default router;
