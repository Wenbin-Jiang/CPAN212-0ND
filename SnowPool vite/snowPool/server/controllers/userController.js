const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Trip = require("../models/tripsModal");
const Booking = require("../models/bookingModal");

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

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      password: hashedPassword,
      notifications: [],
      createdTrips: [],
      bookings: [],
      ratings: {
        asDriver: { average: 0, count: 0 },
        asPassenger: { average: 0, count: 0 },
      },
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: {
        id: user._id,
        email: user.email,
        token,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email })
      .select("+password")
      .populate("notifications.booking")
      .populate("notifications.trip");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          profileComplete: user.profileComplete,
          notifications: user.notifications,
        },
      },
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

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    Object.assign(user, {
      name,
      address,
      gender,
      birthday,
      phone,
      driverHistory,
      carModel,
      licensePlate,
      bio,
    });

    user.profileComplete = checkProfileCompletion(user);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        gender: user.gender,
        birthday: user.birthday,
        phone: user.phone,
        driverHistory: user.driverHistory,
        carModel: user.carModel,
        licensePlate: user.licensePlate,
        bio: user.bio,
        profileComplete: user.profileComplete,
        ratings: user.ratings,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("createdTrips")
      .populate("bookings")
      .populate("notifications.booking")
      .populate("notifications.trip");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete User Account
const deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Delete associated data
    await Promise.all([
      // Delete user's trips
      Trip.deleteMany({ user: req.user.id }),
      // Update bookings
      Booking.updateMany(
        { $or: [{ passenger: req.user.id }, { driver: req.user.id }] },
        { status: "cancelled" }
      ),
      // Delete user
      User.findByIdAndDelete(req.user.id),
    ]);

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

// Get User Notifications
const getUserNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("notifications")
      .populate("notifications.booking")
      .populate("notifications.trip");

    res.status(200).json({
      success: true,
      data: user.notifications,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Mark Notification as Read
const markNotificationRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const user = await User.findById(req.user.id);

    const notification = user.notifications.id(notificationId);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    notification.read = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

module.exports = {
  registerUser,
  loginUser,
  updateUserProfile,
  getUserProfile,
  deleteUserAccount,
  getUserNotifications,
  markNotificationRead,
};
