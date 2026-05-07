import "dotenv/config";
import mongoose from "mongoose";
import { Server as SocketIOServer } from "socket.io";
import { createServer } from "http";
import { v2 as cloudinary } from "cloudinary";
import { createApp } from "./app";

// Removed NestJS - Using Express only

// Environment Variables Validation
const requiredEnvVars = [
  "MONGODB_CONNECTION_STRING",
  "JWT_SECRET_KEY",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "PAYOS_CLIENT_ID",
  "PAYOS_API_KEY",
  "PAYOS_CHECKSUM_KEY",
  // "STRIPE_API_KEY", // ❌ XÓA (không dùng nữa)
];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

// Khi chạy test (CI), cho phép skip bắt buộc env để chạy unit/integration test cơ bản.
if (missingEnvVars.length > 0 && process.env.NODE_ENV !== "test") {
  console.error("❌ Missing required environment variables:");
  missingEnvVars.forEach((envVar) => console.error(`   - ${envVar}`));
  process.exit(1);
}

console.log("✅ All required environment variables are present");
console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || "Not set"}`);

if (process.env.NODE_ENV !== "test") {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log("☁️  Cloudinary configured successfully");
}

// MongoDB Connection with Error Handling
const connectDB = async () => {
  try {
    console.log("📡 Attempting to connect to MongoDB...");
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);
    console.log("✅ MongoDB connected successfully");
    console.log(`📦 Database: ${mongoose.connection.db.databaseName}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    console.error("💡 Please check your MONGODB_CONNECTION_STRING");
    process.exit(1);
  }
};

// Handle MongoDB connection events
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️  MongoDB disconnected. Attempting to reconnect...");
});

mongoose.connection.on("error", (error) => {
  console.error("❌ MongoDB connection error:", error);
});

mongoose.connection.on("reconnected", () => {
  console.log("✅ MongoDB reconnected successfully");
});

if (process.env.NODE_ENV !== "test") {
  connectDB();
}

const app = createApp({ enableCloudinary: process.env.NODE_ENV !== "test" });

// Dynamic Port Configuration (for Render and local development)
const PORT = process.env.PORT || 7002;

// SETUp socket.io cho toàn bộ server
// Create HTTP server from Express app
const httpServer = createServer(app);

// Setup Socket.IO server
const allowedSocketOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5174",
  "http://localhost:5173",
].filter((origin): origin is string => Boolean(origin));

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps)
      if (!origin) return callback(null, true);

      // In development, allow all localhost origins
      if (process.env.NODE_ENV === "development" || !process.env.NODE_ENV) {
        if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
          return callback(null, true);
        }
      }

      // Check if origin is in allowed list
      if (allowedSocketOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  },
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log(`✅ Socket.IO client connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`❌ Socket.IO client disconnected: ${socket.id}`);
  });
});

// Set io instance để dùng trong controllers
import { setIO } from "./shared/socket";
setIO(io);

// Start HTTP server (includes Express + Socket.IO)
httpServer.listen(PORT, () => {
  console.log("🚀 ============================================");
  console.log(`✅ Express Server running on port ${PORT}`);
  console.log(`✅ Socket.IO Server running on port ${PORT}`);
  console.log(`📦 Express routes: /api/*`);
  console.log(`🆕 V2 routes: /api/v2/*`);
  console.log(`🌐 Local: http://localhost:${PORT}`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
  console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
  console.log("🚀 ============================================");
});

// Graceful Shutdown Handler
const gracefulShutdown = async (signal: string) => {
  console.log(`\n⚠️  ${signal} received. Starting graceful shutdown...`);

  try {
    // Close Socket.IO server
    io.close(() => {
      console.log("🔒 Socket.IO server closed");
    });

    // Close HTTP server (includes Express)
    httpServer.close(async () => {
      console.log("🔒 HTTP server closed");

      // Close MongoDB connection
      await mongoose.connection.close();
      console.log("🔒 MongoDB connection closed");
      console.log("✅ Graceful shutdown completed");
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
    process.exit(1);
  }

  // Force shutdown after 30 seconds
  setTimeout(() => {
    console.error("⚠️  Forced shutdown after timeout");
    process.exit(1);
  }, 30000);
};

// Handle shutdown signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  gracefulShutdown("UNCAUGHT_EXCEPTION");
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  gracefulShutdown("UNHANDLED_REJECTION");
});
