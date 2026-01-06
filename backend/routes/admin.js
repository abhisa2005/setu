const express = require("express");
const Case = require("../models/Case");
const { authMiddleware, adminOnly } = require("../middleware/auth");

const router = express.Router();

// protect all admin routes
router.use(authMiddleware);
router.use(adminOnly);

// list all cases (admin)
router.get("/cases", async (req, res) => {
  try {
    const list = await Case.find().sort("-createdAt").limit(100);
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// approve case (SAFE: does not remove location)
router.put("/cases/:id/approve", async (req, res) => {
  try {
    const c = await Case.findById(req.params.id);
    if (!c) return res.status(404).json({ message: "Not found" });

    c.approved = true;
    if (req.body.notes) c.notes = req.body.notes;

    await c.save();
    res.json({ message: "Approved", case: c });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// reject case
router.put("/cases/:id/reject", async (req, res) => {
  try {
    const c = await Case.findById(req.params.id);
    if (!c) return res.status(404).json({ message: "Not found" });

    c.approved = false;
    if (req.body.notes) c.notes = req.body.notes;

    await c.save();
    res.json({ message: "Rejected", case: c });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

