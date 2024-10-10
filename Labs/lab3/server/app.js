const PORT = process.env.PORT || 8000;
const express = require("express");
const app = express();
const cors = require("cors");

const save_router = require("./routers/save_router");
const fetch_router = require("./routers/fetch_router");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Routes
app.use("/save", save_router);
app.use("/fetch", fetch_router);

app.get("/", (req, res) => {
  res.send("Welcome to our server");
});

// Catch-all for 404 errors
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
