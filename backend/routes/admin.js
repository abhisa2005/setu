const express = require("express");
const Case = require("../models/Case");
const { authMiddleware, adminOnly } = require("../middleware/auth");
const router = express.Router();

router.use(authMiddleware);
router.use(adminOnly);

// list all (admin)
router.get("/cases", async (req,res) => {
  const list = await Case.find().sort("-createdAt").limit(100);
  res.json(list);
});

router.put("/cases/:id/approve", async (req,res) => {
  const id = req.params.id;
  const c = await Case.findById(id);
  if (!c) return res.status(404).json({ message: "Not found" });
  c.approved = true;
  c.notes = req.body.notes || c.notes;
  await c.save();
  res.json({ message: "Approved" });
});

router.put("/cases/:id/reject", async (req,res) => {
  const id = req.params.id;
  const c = await Case.findById(id);
  if (!c) return res.status(404).json({ message: "Not found" });
  c.approved = false;
  c.notes = req.body.notes || c.notes;
  await c.save();
  res.json({ message: "Rejected" });
});

module.exports = router;
