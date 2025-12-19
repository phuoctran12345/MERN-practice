require("dotenv").config();
const mongoose = require("mongoose");

const conection = async () => {
  try {
    // Build MongoDB connection URI from environment variables
    const dbHost = process.env.DB_HOST;
    const dbPort = process.env.DB_PORT;
    const dbName = process.env.DB_NAME;
    const dbUser = process.env.DB_USER || "";
    const dbPassword = process.env.DB_PASSWORD || "";

    // Create connection string: mongodb://[user:password@]host:port/dbname
    let mongoUri = `mongodb://${dbHost}:${dbPort}/${dbName}`;

    const options = {};
    if (dbUser && dbPassword) {
      mongoUri = `mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
    }

    await mongoose.connect(mongoUri, options);
    const state = Number(mongoose.connection.readyState);
    const stateMap = {
      0: "Disconnected",
      1: "Connected",
      2: "Connecting",
      3: "Disconnecting",
    };

    console.log(`Trạng thái kết nối: ${stateMap[state]} to DB`);
    console.log("Kết nối thành công nha !!! ");
  } catch (error) {
    console.log("MongoDB Connection Error:", error.message);
    throw new Error("Có vấn đề ở dòng: " + error.message);
  }
};

module.exports = conection;
