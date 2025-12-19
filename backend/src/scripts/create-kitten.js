// Small script to connect and insert a Kitten document
// Run with: `node src/scripts/create-kitten.js`

const connectDB = require("../config/database");
const Kitten = require("../models/Kitten");

const run = async () => {
  try {
    await connectDB();
    const silence = new Kitten({ name: "Silence" });
    const saved = await silence.save();
    console.log("Saved Kitten:", saved);
    process.exit(0);
  } catch (err) {
    console.error("Error inserting kitten:", err);
    process.exit(1);
  }
};

run();
