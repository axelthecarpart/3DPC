import { Request, Response } from "express";
import { db } from "../db";

// Get builds by user
export const getBuildsByUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const [builds] = await db.query("SELECT * FROM user_builds WHERE user_id = ?", [userId]);
    res.json({ items: builds });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Add a build
export const addBuild = async (req: Request, res: Response) => {
  const { userId, buildName, partIds } = req.body; // partIds is an array of pc_part IDs

  try {
    // Create build
    const [result] = await db.query("INSERT INTO user_builds (user_id, build_name) VALUES (?, ?)", [
      userId,
      buildName,
    ]);
    const buildId = (result as any).insertId;

    // Add parts to build
    for (const partId of partIds) {
      await db.query("INSERT INTO build_parts (build_id, part_id) VALUES (?, ?)", [buildId, partId]);
    }

    res.status(201).json({ message: "Build created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
