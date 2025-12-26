import { Request, Response } from "express";
import fs from "fs";
import path from "path";

export const getPartsByType = (req: Request, res: Response) => {
  try {
    const { type } = req.params; // cpu, gpu, ram, etc.
    const filePath = path.join(__dirname, `../../data/${type}s/${type}s.json`);

    const parts = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    res.json({ items: parts });
  } catch (err) {
    console.error("Error reading parts file:", err);
    res.status(500).json({ message: "Server error" });
  }
};
