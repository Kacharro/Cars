import bcrypt from "bcryptjs";
import db from "../Database/db.js";

const SALT_ROUNDS = 10;

export function register(email, password) {
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    throw new Error("Email already registered");
  }

  const passwordHash = bcrypt.hashSync(password, SALT_ROUNDS);
  const result = db.prepare("INSERT INTO users (email, password_hash) VALUES (?, ?)").run(email, passwordHash);

  return { id: result.lastInsertRowid, email };
}

export function login(email, password) {
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const valid = bcrypt.compareSync(password, user.password_hash);
  if (!valid) {
    throw new Error("Invalid credentials");
  }

  return { id: user.id, email: user.email };
}
