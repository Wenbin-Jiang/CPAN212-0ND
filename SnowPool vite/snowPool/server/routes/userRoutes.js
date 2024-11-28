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
const protectAndAuthorize = require("../middleware/authMiddleware");

// Authentication routes (public)
router.post("/register", registerUser);
router.post("/login", loginUser);

// Profile management (protected)
router.get("/profile", protectAndAuthorize, getUserProfile);
router.put("/profile", protectAndAuthorize, updateUserProfile);
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
    message: "Something went wrong!",
  });
});

module.exports = router;
