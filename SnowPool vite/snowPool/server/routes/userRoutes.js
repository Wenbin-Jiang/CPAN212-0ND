const express = require("express");
const {
  registerUser,
  loginUser,
  updateUserProfile,
  getUserProfile,
} = require("../controllers/userController");
const protectAndAuthorize = require("../middleware/authMiddleware");

const router = express.Router();

// User routes
router.post("/register", registerUser); // Public
router.post("/login", loginUser); // Public
router.put("/profile", protectAndAuthorize, updateUserProfile); // Protected
router.get("/profile", protectAndAuthorize, getUserProfile); // Protected
module.exports = router;
