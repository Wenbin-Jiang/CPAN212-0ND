const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Connect to database
connectDB();

// Handle uploads directory
const fs = require("fs");
const uploads = path.join(__dirname, "uploads");
if (!fs.existsSync(uploads)) {
  fs.mkdirSync(uploads);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploads));

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
  });
});

// API Routes
const userRoutes = require("./routes/userRoutes");
const tripRoutes = require("./routes/tripRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
// const paymentRoutes = require("./routes/paymentRoutes");

app.use("/api/users", userRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/bookings", bookingRoutes);
// app.use("/api/payments", paymentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.url} not found`,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;
