const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userStore = require("./userStore");

function createUserId() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return crypto.randomBytes(16).toString("hex");
}

async function register({ username, email, password }) {
  const normalizedUsername = String(username || "").trim();
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const pwd = String(password || "");

  if (normalizedUsername.length < 3) {
    const err = new Error("Username must be at least 3 characters");
    err.statusCode = 400;
    throw err;
  }
  if (!normalizedEmail.includes("@")) {
    const err = new Error("Email is invalid");
    err.statusCode = 400;
    throw err;
  }
  if (pwd.length < 6) {
    const err = new Error("Password must be at least 6 characters");
    err.statusCode = 400;
    throw err;
  }

  const exists = await userStore.findByUsernameOrEmail({
    username: normalizedUsername,
    email: normalizedEmail,
  });
  if (exists) {
    const err = new Error("User already exists");
    err.statusCode = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(pwd, 10);
  const user = {
    id: createUserId(),
    username: normalizedUsername,
    email: normalizedEmail,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  await userStore.addUser(user);
  return { id: user.id, username: user.username, email: user.email };
}

async function login({ usernameOrEmail, password }) {
  const identifier = String(usernameOrEmail || "").trim();
  const pwd = String(password || "");

  if (!identifier) {
    const err = new Error("Missing username/email");
    err.statusCode = 400;
    throw err;
  }
  if (!pwd) {
    const err = new Error("Missing password");
    err.statusCode = 400;
    throw err;
  }

  const looksLikeEmail = identifier.includes("@");

  const existing = await userStore.findByUsernameOrEmail({
    username: looksLikeEmail ? undefined : identifier,
    email: looksLikeEmail ? identifier.toLowerCase() : undefined,
  });

  if (!existing) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  const ok = await bcrypt.compare(pwd, existing.passwordHash);
  if (!ok) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  const token = signToken({ sub: existing.id, username: existing.username });
  return {
    token,
    user: { id: existing.id, username: existing.username, email: existing.email },
  };
}

function signToken(payload) {
  const jwtSecret = process.env.JWT_SECRET || "dev_secret_change_me";
  return jwt.sign({ sub: payload.sub, username: payload.username }, jwtSecret, { expiresIn: "7d" });
}

function verifyToken(token) {
  const jwtSecret = process.env.JWT_SECRET || "dev_secret_change_me";
  return jwt.verify(token, jwtSecret);
}

async function getMe(userId) {
  const user = await userStore.getUserById(userId);
  if (!user) return null;
  return { id: user.id, username: user.username, email: user.email };
}

module.exports = {
  register,
  login,
  verifyToken,
  getMe,
};
