require("dotenv").config();
const PORT = process.env.PORT || 8000;
const express = require("express");
const app = express();
const cors = require("cors");
const recipesRouter = require("./recipes_router");

// adding mongoDB database
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_KEY);
const db = mongoose.connection;

db.once("open", () => {
  // Check connection
  console.log("Connected to MongoDB");
});

db.on("error", (err) => {
  // Check for DB errors
  console.log("DB Error");
});

// Allow requests from client
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// middlelware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// root
app.get("/", (req, res) => {
  res.send("Welcome to our server");
});

// Routes
app.use("/recipe", recipesRouter);

//404
app.use("", (req, res) => {
  res.status(404).send("Page not found");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
