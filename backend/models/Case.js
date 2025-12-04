const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema({
  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  disease: { type: String, required: true },
  symptoms: [String],
  severity: { type: String, enum: ["mild","moderate","severe"], default: "mild" },
  reportedAt: { type: Date, default: Date.now },
  observedAt: Date,
  location: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: [Number], required: true } // [lon, lat]
  },
  approved: { type: Boolean, default: false },
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

caseSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Case", caseSchema);
