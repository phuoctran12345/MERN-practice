// const express = require("express");
import express from "express";
import "dotenv/config";
import path from "path";
import webRoutes from "./routes/web";

// thêm cái ni zo để kết nối DB
// connect database (CommonJS module)
const connectDB = require("./config/database");

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// config view engine
app.set("view engine", "ejs");
// use project-root based path so both ts-node (src) và dist đều tìm đúng file
app.set("views", path.join(__dirname, "views"));
console.log("Views path:", path.join(__dirname, "views"));

// Test route trước khi load web routes
app.get("/ping", (req, res) => {
  console.log("Ping route accessed");
  res.json({
    message: "Server hoạt động!",
    timestamp: new Date().toISOString(),
  });
});

//config static files
app.use(express.static(path.join(__dirname, "public"))); // lấy ra những file tĩnh trong mục static của folder public

// register routes from src/routes
webRoutes(app);

const createKitten = require("./server");

// Initialize server with DB connection
const startServer = async () => {
  try {
    await connectDB();

    await createKitten();
    app.listen(PORT, () => {
      console.log(`Example app listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
