const express = require("express");
const {
  registerUser,
  loginUser,
  updateUserProfile,
  getUserProfile,
  deleteUserAccount,
} = require("../controllers/userController");
const protectAndAuthorize = require("../middleware/authMiddleware");

const router = express.Router();

// User routes

// Public
router.post("/register", registerUser);
router.post("/login", loginUser);
// Protected
router.put("/profile/update", protectAndAuthorize, updateUserProfile);
router.get("/profile", protectAndAuthorize, getUserProfile);
router.delete("/profile/delete", protectAndAuthorize, deleteUserAccount);

module.exports = router;
