const express = require("express");
const { body, validationResult } = require("express-validator");
const Case = require("../models/Case");

const router = express.Router();

// GET public cases (approved only) with simple filters
router.get("/", async (req,res) => {
  const { disease, from, to, lat, lon, radiusKm = 50 } = req.query;
  const query = { approved: true };
  if (disease) query.disease = disease;
  if (from || to) query.reportedAt = {};
  if (from) query.reportedAt.$gte = new Date(from);
  if (to) query.reportedAt.$lte = new Date(to);

  if (lat && lon) {
    query.location = {
      $nearSphere: {
        $geometry: { type: "Point", coordinates: [parseFloat(lon), parseFloat(lat)] },
        $maxDistance: (parseFloat(radiusKm) || 50) * 1000
      }
    };
  }
  try {
    const cases = await Case.find(query).limit(500);
    res.json(cases);
  } catch (err) { res.status(500).json({ message: "Server error" }); }
});

// POST report a case
router.post("/",
  body("disease").notEmpty(),
  body("location").notEmpty(),
  async (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const { disease, symptoms = [], severity="mild", observedAt, location } = req.body;
      const newCase = new Case({ disease, symptoms, severity, observedAt, location });
      await newCase.save();
      res.status(201).json({ message: "Report submitted for review", case: newCase });
    } catch (err) { console.error(err); res.status(500).json({ message: "Server error" }); }
});

router.get("/:id", async (req,res) => {
  try {
    const c = await Case.findById(req.params.id);
    if (!c) return res.status(404).json({ message: "Not found" });
    const safe = {
      id: c._id,
      disease: c.disease,
      symptoms: c.symptoms,
      severity: c.severity,
      reportedAt: c.reportedAt,
      observedAt: c.observedAt,
      location: c.location,
      approved: c.approved,
      notes: c.notes
    };
    res.json(safe);
  } catch (err) { res.status(500).json({ message: "Server error" }); }
});

module.exports = router;
