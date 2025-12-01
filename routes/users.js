// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");
// const pool = require("../db");
// const { authorizeAdmin } = require("../middleware/auth");

// // Admin: Create a User
// router.post("/", authorizeAdmin, async (req, res) => {
//   const { name, email, password } = req.body;
//   try {
//     const hash = await bcrypt.hash(password, 10);
//     await pool.query(
//       "INSERT INTO users (name, email, password_hash, admin_id) VALUES (?, ?, ?, ?)",
//       [name, email, hash, req.user.id]
//     );
//     res.json({ message: "User created successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Admin: List Associated Users
// router.get("/", authorizeAdmin, async (req, res) => {
//   try {
//     const [rows] = await pool.query(
//       "SELECT id, name, email FROM users WHERE admin_id = ?",
//       [req.user.id]
//     );
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // User: My Profile
// router.get("/me", async (req, res) => {
//   try {
//     const [rows] = await pool.query(
//       "SELECT id, name, email, role FROM users WHERE id = ?",
//       [req.user.id]
//     );
//     res.json(rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;


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

    // Insert new user
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'user')",
      [name, email, hash]
    );

    const userId = result.insertId;

    // Insert admin-user relation in mapping table
    await pool.query(
      "INSERT INTO user_admin_map (user_id, admin_id) VALUES (?, ?)",
      [userId, req.user.id]
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
      `SELECT u.id, u.name, u.email
       FROM user_admin_map m
       JOIN users u ON m.user_id = u.id
       WHERE m.admin_id = ?`,
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
