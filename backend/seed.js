require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const Case = require("./models/Case");

(async ()=> {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected");

  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "AdminPass123";

  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = new User({ name:"Admin", email: adminEmail, passwordHash: await bcrypt.hash(adminPassword,10), role:"admin" });
    await admin.save();
    console.log("Admin created", adminEmail, "password:", adminPassword);
  } else {
    console.log("Admin exists:", adminEmail);
  }

  const sample = new Case({
    disease: "dengue",
    symptoms: ["fever","headache"],
    severity: "moderate",
    observedAt: new Date(),
    location: { type: "Point", coordinates: [77.2090, 28.6139] },
    approved: true
  });
  await sample.save();
  console.log("Sample case saved");

  process.exit(0);
})();
