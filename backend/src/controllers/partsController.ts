import { Request, Response } from "express";
import fs from "fs";
import path from "path";

const dataDir = path.join(__dirname, "../../data");

// Helper function to read all CPU files from the cpus directory
const readAllCPUs = () => {
  const cpusDir = path.join(dataDir, "cpus");
  const cpus: any[] = [];

  const files = fs.readdirSync(cpusDir);

  for (const file of files) {
    const filePath = path.join(cpusDir, file);
    const stat = fs.statSync(filePath);

    // Only read files (not directories like 'images' or '3d')
    if (stat.isFile() && !file.endsWith(".py")) {
      try {
        const content = fs.readFileSync(filePath, "utf-8");
        const cpu = JSON.parse(content);
        cpus.push(cpu);
      } catch (error) {
        console.error(`Error reading CPU file ${file}:`, error);
      }
    }
  }

  return cpus;
};

// Generic helper to read all JSON files from a directory (useful for storage folder)
const readAllJsonInDir = (folderName: string) => {
  const dir = path.join(dataDir, folderName);
  const items: any[] = [];

  if (!fs.existsSync(dir)) return items;

  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isFile() && file.endsWith('.json')) {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const obj = JSON.parse(content);
        items.push(obj);
      } catch (error) {
        console.error(`Error reading JSON file ${filePath}:`, error);
      }
    }
  }

  return items;
};

export const getCPUs = (req: Request, res: Response) => {
  try {
    const cpus = readAllCPUs();
    res.json(cpus);
  } catch (error) {
    console.error("Error reading CPUs:", error);
    res.status(500).json({ error: "Failed to load CPUs" });
  }
};

export const getGPUs = (req: Request, res: Response) => {
  try {
    const gpusPath = path.join(dataDir, "gpus", "gpus.json");
    const gpus = JSON.parse(fs.readFileSync(gpusPath, "utf-8"));
    res.json(gpus);
  } catch (error) {
    res.status(500).json({ error: "Failed to load GPUs" });
  }
};

export const getRAM = (req: Request, res: Response) => {
  try {
    const ramPath = path.join(dataDir, "ram", "ram.json");
    const ram = JSON.parse(fs.readFileSync(ramPath, "utf-8"));
    res.json(ram);
  } catch (error) {
    res.status(500).json({ error: "Failed to load RAM" });
  }
};

export const getStorage = (req: Request, res: Response) => {
  try {
    // Prefer a single storage.json file if present, otherwise read all individual JSON files in the folder
    const storageJsonPath = path.join(dataDir, "storage", "storage.json");
    if (fs.existsSync(storageJsonPath)) {
      const storage = JSON.parse(fs.readFileSync(storageJsonPath, "utf-8"));
      res.json(storage);
      return;
    }

    const items = readAllJsonInDir('storage');
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to load storage" });
  }
};

export const getCases = (req: Request, res: Response) => {
  try {
    const casesPath = path.join(dataDir, "cases", "cases.json");
    const cases = JSON.parse(fs.readFileSync(casesPath, "utf-8"));
    res.json(cases);
  } catch (error) {
    res.status(500).json({ error: "Failed to load cases" });
  }
};

export const getPartsByType = (req: Request, res: Response) => {
  try {
    const { type } = req.params; // cpu, gpu, ram, etc.
    const resolveFilePath = (t: string) => {
      const folderMap: { [k: string]: string } = {
        psu: "power supplies",
        "cpu-cooler": "cpu coolers",
        case: "cases",
        motherboard: "motherboards",
        storage: "storage",
      };

      const candidates: string[] = [];
      const mapped = folderMap[t];
      if (mapped) {
        candidates.push(
          path.join(__dirname, `../../data/${mapped}/${mapped}.json`)
        );
        candidates.push(path.join(__dirname, `../../data/${mapped}/${t}.json`));
      }

      candidates.push(path.join(__dirname, `../../data/${t}s/${t}s.json`));
      candidates.push(path.join(__dirname, `../../data/${t}s/${t}.json`));
      candidates.push(path.join(__dirname, `../../data/${t}/${t}.json`));
      candidates.push(path.join(__dirname, `../../data/${t}/${t}s.json`));

      for (const p of candidates) {
        if (fs.existsSync(p)) return p;
      }
      return null;
    };

    const filePath = resolveFilePath(type);
    if (!filePath) throw new Error(`Parts file not found for type: ${type}`);

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
        psu: "power supplies",
        "cpu-cooler": "cpu coolers",
        case: "cases",
        motherboard: "motherboards",
        storage: "storage",
      };

      const candidates: string[] = [];
      const mapped = folderMap[t];
      if (mapped) {
        candidates.push(
          path.join(__dirname, `../../data/${mapped}/${mapped}.json`)
        );
        candidates.push(path.join(__dirname, `../../data/${mapped}/${t}.json`));
      }

      candidates.push(path.join(__dirname, `../../data/${t}s/${t}s.json`));
      candidates.push(path.join(__dirname, `../../data/${t}s/${t}.json`));
      candidates.push(path.join(__dirname, `../../data/${t}/${t}.json`));
      candidates.push(path.join(__dirname, `../../data/${t}/${t}s.json`));

      for (const p of candidates) {
        if (fs.existsSync(p)) return p;
      }
      return null;
    };

    const filePath = resolveFilePath(type);
    if (!filePath) throw new Error(`Parts file not found for type: ${type}`);

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
