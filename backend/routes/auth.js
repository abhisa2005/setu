const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/register",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  async (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: "Email already registered" });
      const passwordHash = await bcrypt.hash(password, 10);
      user = new User({ name, email, passwordHash });
      await user.save();
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
      res.json({ token, user: { id: user._id, name: user.name, email: user.email }});
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
});

router.post("/login",
  body("email").isEmail(),
  body("password").exists(),
  async (req,res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "Invalid credentials" });
      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) return res.status(400).json({ message: "Invalid credentials" });
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
      res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role }});
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
