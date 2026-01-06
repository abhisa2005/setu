const jwt = require("jsonwebtoken");

/**
 * Auth middleware (logged-in users)
 */
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "No token provided" });
  }

  const parts = header.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Invalid authorization format" });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

/**
 * Admin-only middleware
 */
function adminOnly(req, res, next) {
  if (req.userRole !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

/**
 * DEFAULT export for cases.js compatibility
 */
module.exports = authMiddleware;

/**
 * Named exports for admin.js compatibility
 */
module.exports.authMiddleware = authMiddleware;
module.exports.adminOnly = adminOnly;
