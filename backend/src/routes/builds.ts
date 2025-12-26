import { Router } from "express";
import { getBuildsByUser, addBuild } from "../controllers/buildsController";

const router = Router();

router.get("/:userId", getBuildsByUser);
router.post("/", addBuild);

export default router;
