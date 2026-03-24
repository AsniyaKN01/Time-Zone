const express = require("express");

const authService = require("../services/authService");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body || {};
    const user = await authService.register({ username, email, password });
    return res.status(201).json({ user });
  } catch (err) {
    const status = err.statusCode || 400;
    return res.status(status).json({ error: err.message || "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body || {};
    if (!usernameOrEmail && req.body?.email) {
      req.body.usernameOrEmail = req.body.email;
    }

    const result = await authService.login({
      usernameOrEmail: req.body.usernameOrEmail,
      password: req.body.password,
    });
    return res.json(result);
  } catch (err) {
    const status = err.statusCode || 400;
    return res.status(status).json({ error: err.message || "Login failed" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  const me = await authService.getMe(req.user.id);
  if (!me) return res.status(404).json({ error: "User not found" });
  return res.json({ user: me });
});

module.exports = router;
