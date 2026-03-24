const fs = require("fs/promises");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

async function ensureUsersFile() {
  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(USERS_FILE, JSON.stringify([], null, 2), "utf8");
  }
}

async function readUsers() {
  await ensureUsersFile();
  const raw = await fs.readFile(USERS_FILE, "utf8");
  const parsed = JSON.parse(raw || "[]");
  return Array.isArray(parsed) ? parsed : [];
}

async function writeUsers(users) {
  await ensureUsersFile();
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

async function findByUsernameOrEmail({ username, email }) {
  const users = await readUsers();
  const u = users.find(
    (x) =>
      x.username.toLowerCase() === String(username).toLowerCase() ||
      x.email.toLowerCase() === String(email).toLowerCase()
  );
  return u || null;
}

async function addUser(user) {
  const users = await readUsers();
  users.push(user);
  await writeUsers(users);
}

async function getUserById(id) {
  const users = await readUsers();
  return users.find((x) => x.id === id) || null;
}

module.exports = {
  findByUsernameOrEmail,
  addUser,
  getUserById,
};
