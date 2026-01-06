const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  disease: { type: String, required: true },

  symptoms: [String],

  severity: {
    type: String,
    enum: ["mild", "moderate", "severe"],
    default: "mild"
  },

  reportedAt: { type: Date, default: Date.now },
  observedAt: Date,

  location: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: [Number], required: true } // [lon, lat]
  },

  approved: { type: Boolean, default: false },
  notes: String,

  createdAt: { type: Date, default: Date.now },

  likelyCauses: {
    type: [String],
    default: []
  },

  prevention: {
    type: [String],
    default: []
  },

  precautions: {
    type: [String],
    default: []
  }
});

caseSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Case", caseSchema);
