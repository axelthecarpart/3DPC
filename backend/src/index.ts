import express from "express";
import cors from "cors";
import path from "path";
import userRoutes from "./routes/users";
import partsRoutes from "./routes/parts";
import buildsRoutes from "./routes/builds";

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the data directory
app.use("/data", express.static(path.join(__dirname, "../data")));

app.get("/", (_req, res) => {
  res.send("3DPC API is running!");
});


app.use("/users", userRoutes);
app.use("/pc-parts", partsRoutes);
app.use("/builds", buildsRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
