import express from "express";
import { getPartsByType, addPartByType } from "../controllers/partsController";
const router = express.Router();

router.get("/pc-parts/:type", getPartsByType);
router.post("/pc-parts/:type", addPartByType);

export default router;
