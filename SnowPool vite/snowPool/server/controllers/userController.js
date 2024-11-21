const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Helper function to check profile completion
const checkProfileCompletion = (user) => {
  return Boolean(
    user.name &&
      user.gender &&
      user.address &&
      user.phone &&
      user.birthday &&
      user.driverHistory &&
      user.carModel &&
      user.licensePlate &&
      user.bio
  );
};

// Register a New User
const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email is already registered." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const user = await User.create({ email, password: hashedPassword });

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: { id: user._id, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
  try {
    const {
      name,
      address,
      gender,
      birthday,
      phone,
      driverHistory,
      carModel,
      licensePlate,
      bio,
    } = req.body;

    // Find the authenticated user and update their profile
    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Update user fields
    user.name = name || user.name;
    user.address = address || user.address;
    user.gender = gender || user.gender;
    user.birthday = birthday || user.birthday;
    user.phone = phone || user.phone;
    user.driverHistory = driverHistory || user.driverHistory;
    user.carModel = carModel || user.carModel;
    user.licensePlate = licensePlate || user.licensePlate;
    user.bio = bio || user.bio;

    // Check and update profile completion
    user.profileComplete = checkProfileCompletion(user);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: {
        id: user._id,
        name: user.name,
        address: user.address,
        profileComplete: user.profileComplete,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude password
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res.status(200).json({
      success: true,
      data: {
        createdAt: user.createdAt,
        id: user._id,
        email: user.email,
        name: user.name,
        address: user.address,
        gender: user.gender,
        birthday: user.birthday,
        phone: user.phone,
        driverHistory: user.driverHistory,
        carModel: user.carModel,
        licensePlate: user.licensePlate,
        bio: user.bio,
        profileComplete: user.profileComplete,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Add to userController.js
const deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Delete user from database
    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateUserProfile,
  getUserProfile,
  deleteUserAccount,
};
