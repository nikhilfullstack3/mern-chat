const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Assuming you have a User model
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if token is sent in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token from the Authorization header
      token = req.headers.authorization.split(" ")[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by decoded token's ID and attach it to the request object
      req.user = await User.findById(decoded.id).select("-password"); // Exclude password from user data

      // Call the next middleware or route handler
      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      res.status(401); // Unauthorized
      throw new Error("Not authorized, token failed");
    }
  }

  // If no token is found
  if (!token) {
    res.status(401); // Unauthorized
    throw new Error("Not authorized, no token");
  }
});

module.exports = protect;
