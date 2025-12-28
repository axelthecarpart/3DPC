import { Request, Response } from "express";
import fs from "fs";
import path from "path";

export const getPartsByType = (req: Request, res: Response) => {
  try {
    const { type } = req.params; // cpu, gpu, ram, etc.
    const resolveFilePath = (t: string) => {
      const folderMap: { [k: string]: string } = {
        psu: 'power supplies',
        'cpu-cooler': 'cpu coolers',
        case: 'cases',
        motherboard: 'motherboards',
        storage: 'storage'
      }

      const candidates: string[] = []
      const mapped = folderMap[t]
      if (mapped) {
        candidates.push(path.join(__dirname, `../../data/${mapped}/${mapped}.json`))
        candidates.push(path.join(__dirname, `../../data/${mapped}/${t}.json`))
      }

      candidates.push(path.join(__dirname, `../../data/${t}s/${t}s.json`))
      candidates.push(path.join(__dirname, `../../data/${t}s/${t}.json`))
      candidates.push(path.join(__dirname, `../../data/${t}/${t}.json`))
      candidates.push(path.join(__dirname, `../../data/${t}/${t}s.json`))

      for (const p of candidates) {
        if (fs.existsSync(p)) return p
      }
      return null
    }

    const filePath = resolveFilePath(type)
    if (!filePath) throw new Error(`Parts file not found for type: ${type}`)

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
    const resolveFilePath = (t: string) => {
      const folderMap: { [k: string]: string } = {
        psu: 'power supplies',
        'cpu-cooler': 'cpu coolers',
        case: 'cases',
        motherboard: 'motherboards',
        storage: 'storage'
      }

      const candidates: string[] = []
      const mapped = folderMap[t]
      if (mapped) {
        candidates.push(path.join(__dirname, `../../data/${mapped}/${mapped}.json`))
        candidates.push(path.join(__dirname, `../../data/${mapped}/${t}.json`))
      }

      candidates.push(path.join(__dirname, `../../data/${t}s/${t}s.json`))
      candidates.push(path.join(__dirname, `../../data/${t}s/${t}.json`))
      candidates.push(path.join(__dirname, `../../data/${t}/${t}.json`))
      candidates.push(path.join(__dirname, `../../data/${t}/${t}s.json`))

      for (const p of candidates) {
        if (fs.existsSync(p)) return p
      }
      return null
    }

    const filePath = resolveFilePath(type)
    if (!filePath) throw new Error(`Parts file not found for type: ${type}`)

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
