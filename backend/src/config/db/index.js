const mongoose = require("mongoose");

async function connect() {
  const uri =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/f8_education_db";
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Connection Sucessfully :", uri);
  } catch (error) {
    console.error("Yooooo yooo youuu failll to connectionn", error.message);
  }
}

module.exports = { connect };
