// routes/admin.js
const express = require('express');
const jwt = require("jsonwebtoken");

const router = express.Router();

const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "1234";
const SECRET = process.env.JWT_SECRET || "secret123";

router.post("/login", (req, res) => {
  const { username, password } = req.body;  
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ role: "admin" }, SECRET, { expiresIn: "1h" });
    return res.json({ token });
  }
  res.status(401).json({ message: "Unauthorized" });
});

module.exports = router;
