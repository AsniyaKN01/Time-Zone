const jwt = require("jsonwebtoken");

function getAuthHeader(req) {
  return req.headers.authorization || req.headers.Authorization;
}

module.exports = function authMiddleware(req, res, next) {
  const header = getAuthHeader(req);
  if (!header || typeof header !== "string" || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }

  const token = header.slice("Bearer ".length).trim();
  const jwtSecret = process.env.JWT_SECRET || "dev_secret_change_me";

  try {
    const payload = jwt.verify(token, jwtSecret);
    req.user = { id: payload.sub, username: payload.username };
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
