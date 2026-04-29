import jwt from "jsonwebtoken";
import * as authService from "../Services/auth.service.js";

export function register(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = authService.register(email, password);
    res.status(201).json({ message: "User registered successfully", user: { id: user.id, email: user.email } });
  } catch (err) {
    if (err.message === "Email already registered") {
      return res.status(409).json({ error: err.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
}

export function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = authService.login(email, password);
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "24h" });

    res.json({ message: "Login successful", token, user: { id: user.id, email: user.email } });
  } catch (err) {
    if (err.message === "Invalid credentials") {
      return res.status(401).json({ error: err.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
}
