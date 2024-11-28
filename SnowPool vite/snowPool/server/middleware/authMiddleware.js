const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protectAndAuthorize = async (req, res, next) => {
  try {
    // Check for authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing or malformed.",
      });
    }

    // Verify token
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided, authorization denied.",
      });
    }

    // Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found with this token.",
      });
    }

    // Add user to request object
    req.user = user;

    // Authorization check for specific routes
    const resourceUserId = req.params.userId || req.body.userId;
    if (resourceUserId && resourceUserId !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this resource.",
      });
    }

    next();
  } catch (err) {
    let errorMessage = "Invalid token.";

    if (err.name === "TokenExpiredError") {
      errorMessage = "Token has expired.";
    } else if (err.name === "JsonWebTokenError") {
      errorMessage = "Malformed token.";
    }

    console.error("Authentication error:", err.message);
    return res.status(401).json({
      success: false,
      message: errorMessage,
    });
  }
};

module.exports = protectAndAuthorize;
