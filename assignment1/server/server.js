import express from "express";
import cors from "cors";
import fetch_router from "./routes/fetch_router.js";
import path from "path";
import { fileURLToPath } from "url";

// File path configuration for ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 6000;

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// Serve static files
app.use("/public", express.static(path.join(__dirname, "public")));

// Use the router for API endpoints
app.use("/", fetch_router);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
