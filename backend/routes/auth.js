const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");

const router = express.Router();

// ================= LOGIN =================
router.post(
  "/login",
  body("email").isEmail(),
  body("password").notEmpty(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Invalid input" });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      if (!user.passwordHash) {
        console.error("User missing passwordHash field");
        return res.status(500).json({ message: "Corrupt user record" });
      }

      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET not defined");
      }

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;

