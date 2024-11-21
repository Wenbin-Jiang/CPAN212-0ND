const jwt = require("jsonwebtoken");

const protectAndAuthorize = (req, res, next) => {
  // Existing protect logic
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authorization header missing or malformed.",
    });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided, authorization denied.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Authorization check for specific routes
    const userIdFromRequest = req.params.id || req.body.id; // Adjust for route structure
    if (userIdFromRequest && userIdFromRequest !== req.user.id) {
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

    console.error("JWT verification failed:", err.message);
    return res.status(401).json({
      success: false,
      message: errorMessage,
    });
  }
};

module.exports = protectAndAuthorize;
