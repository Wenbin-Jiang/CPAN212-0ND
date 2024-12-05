const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  updateUserProfile,
  getUserProfile,
  deleteUserAccount,
  getUserNotifications,
  markNotificationRead,
} = require("../controllers/userController");
const multer = require("multer");
const path = require("path");
const protectAndAuthorize = require("../middleware/authMiddleware");

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Create multer instance with configuration
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    if (allowedTypes.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only .png, .jpg and .jpeg formats allowed"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Authentication routes (public)
router.post("/register", registerUser);
router.post("/login", loginUser);

// Profile management (protected)
router.get("/profile", protectAndAuthorize, getUserProfile);
router.put(
  "/profile",
  protectAndAuthorize,
  upload.single("profilePicture"),
  updateUserProfile
);
router.delete("/profile", protectAndAuthorize, deleteUserAccount);

// Notification management (protected)
router.get("/notifications", protectAndAuthorize, getUserNotifications);
router.put(
  "/notifications/:notificationId/read",
  protectAndAuthorize,
  markNotificationRead
);

// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Something went wrong!",
  });
});

module.exports = router;
