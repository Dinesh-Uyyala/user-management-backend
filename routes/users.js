const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const pool = require("../db");
const { authorizeAdmin } = require("../middleware/auth");

// Admin: Create a User
router.post("/", authorizeAdmin, async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (name, email, password_hash, admin_id) VALUES (?, ?, ?, ?)",
      [name, email, hash, req.user.id]
    );
    res.json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: List Associated Users
router.get("/", authorizeAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email FROM users WHERE admin_id = ?",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User: My Profile
router.get("/me", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id = ?",
      [req.user.id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
