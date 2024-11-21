const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  // Check if the Authorization header exists
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authorization header missing or malformed.",
    });
  }

  // Extract the token from the Authorization header
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided, authorization denied.",
    });
  }

  try {
    // Verify the token and decode the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user info to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // Handle specific JWT errors
    let errorMessage = "Invalid token.";
    if (err.name === "TokenExpiredError") {
      errorMessage = "Token has expired.";
    } else if (err.name === "JsonWebTokenError") {
      errorMessage = "Malformed token.";
    }

    console.error("JWT verification failed:", err.message); // Debugging log
    return res.status(401).json({
      success: false,
      message: errorMessage,
    });
  }
};

module.exports = protect;
