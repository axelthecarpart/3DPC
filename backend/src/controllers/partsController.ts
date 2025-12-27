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

// Add this function for POST /pc-parts/:type
export const addPartByType = (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const filePath = path.join(__dirname, `../../data/${type}s/${type}s.json`);

    // Read existing parts
    const parts = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // Add new part from request body
    parts.push(req.body);

    // Write updated parts back to file
    fs.writeFileSync(filePath, JSON.stringify(parts, null, 2), "utf-8");

    res.status(201).json({ message: `${type} added!` });
  } catch (err) {
    console.error("Error adding part:", err);
    res.status(500).json({ message: "Server error" });
  }
};
