const express = require("express");
const { body, validationResult } = require("express-validator");
const Case = require("../models/Case");

const router = express.Router();

/**
 * GET cases for map
 * DEV MODE: show ALL cases (approved + unapproved)
 * PROD: you can later restrict to approved only
 */
router.get("/", async (req, res) => {
  const { disease, from, to, lat, lon, radiusKm = 50 } = req.query;

  const query = {}; // 🔴 REMOVED approved filter

  if (disease) query.disease = disease;

  if (from || to) {
    query.reportedAt = {};
    if (from) query.reportedAt.$gte = new Date(from);
    if (to) query.reportedAt.$lte = new Date(to);
  }

  if (lat && lon) {
    query.location = {
      $nearSphere: {
        $geometry: {
          type: "Point",
          coordinates: [Number(lon), Number(lat)], // lng, lat
        },
        $maxDistance: Number(radiusKm) * 1000,
      },
    };
  }

  try {
    const cases = await Case.find(query).limit(500);
    res.json(cases);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST report a case
 * Ensures correct GeoJSON format
 */
router.post(
  "/",
  body("disease").notEmpty(),
  body("location.coordinates").isArray({ min: 2 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const {
        disease,
        symptoms = [],
        severity = "mild",
        observedAt,
        location,
      } = req.body;

      const safeLocation = {
        type: "Point",
        coordinates: [
          Number(location.coordinates[0]), // lng
          Number(location.coordinates[1]), // lat
        ],
      };

      const newCase = await Case.create({
        disease,
        symptoms,
        severity,
        observedAt,
        location: safeLocation,
      });

      res.status(201).json({
        message: "Report submitted",
        case: newCase,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * GET case by id (safe view)
 */
router.get("/:id", async (req, res) => {
  try {
    const c = await Case.findById(req.params.id);
    if (!c) return res.status(404).json({ message: "Not found" });

    res.json({
      id: c._id,
      disease: c.disease,
      symptoms: c.symptoms,
      severity: c.severity,
      reportedAt: c.reportedAt,
      observedAt: c.observedAt,
      location: c.location,
      approved: c.approved,
      notes: c.notes,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

