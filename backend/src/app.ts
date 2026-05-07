import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import swaggerUi from "swagger-ui-express";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";

// Express routes imports
import userRoutes from "./express/routes/users";
import authRoutes from "./express/routes/auth";
import myHotelRoutes from "./express/routes/my-hotels";
import hotelRoutes from "./express/routes/hotels";
import bookingRoutes from "./express/routes/my-bookings";
import bookingsManagementRoutes from "./express/routes/bookings";
import healthRoutes from "./express/routes/health";
import businessInsightsRoutes from "./express/routes/business-insights";
import roomsRoutes from "./express/routes/rooms";
import serviceRequestsRoutes from "./express/routes/service-requests";
import bookingOperationsRoutes from "./express/routes/booking-operations";
import paymentRoutes from "./express/routes/payments";
import promotionsRoutes from "./express/routes/promotions";
import employeesRoutes from "./express/routes/employees";

import { specs } from "./shared/swagger";
import customOpenApi from "./shared/customOpenApi";

type CreateAppOptions = {
  enableCloudinary?: boolean;
};

export function createApp(options: CreateAppOptions = {}) {
  const { enableCloudinary = true } = options;

  const app = express();

  // Security middleware
  app.use(helmet());

  // Trust proxy for production (fixes rate limiting issues)
  app.set("trust proxy", 1);

  // Rate limiting - more lenient for payment endpoints
  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  });

  const paymentLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: "Too many payment requests, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use("/api/", generalLimiter);
  app.use("/api/hotels/*/bookings/payment-intent", paymentLimiter);

  // Compression + logging
  app.use(compression());
  app.use(morgan("combined"));

  const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5174",
    "http://localhost:5173",
    "https://mern-booking-hotel.netlify.app",
    "https://mern-booking-hotel.netlify.app/",
  ].filter((origin): origin is string => Boolean(origin));

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        if (process.env.NODE_ENV === "development" || !process.env.NODE_ENV) {
          if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
            return callback(null, true);
          }
        }

        if (origin.includes("netlify.app")) {
          return callback(null, true);
        }

        if (origin.includes("vercel.app")) {
          return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        if (process.env.NODE_ENV === "development") {
          console.log("CORS blocked origin:", origin);
        }

        return callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
      optionsSuccessStatus: 204,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Cookie",
        "X-Requested-With",
      ],
    }),
  );

  app.options(
    "*",
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        if (process.env.NODE_ENV === "development" || !process.env.NODE_ENV) {
          if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
            return callback(null, true);
          }
        }

        if (origin.includes("netlify.app")) {
          return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
      optionsSuccessStatus: 204,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Cookie",
        "X-Requested-With",
      ],
    }),
  );

  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use((req, res, next) => {
    res.header("Vary", "Origin");
    next();
  });

  if (enableCloudinary) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  app.get("/", (req, res) => {
    res.send("<h1>Hotel Booking Backend API is running 🚀</h1>");
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/my-hotels", myHotelRoutes);
  app.use("/api/hotels", hotelRoutes);
  app.use("/api/my-bookings", bookingRoutes);
  app.use("/api/bookings", bookingsManagementRoutes);
  app.use("/api/health", healthRoutes);
  app.use("/api/business-insights", businessInsightsRoutes);

  app.use("/api/v2/rooms", roomsRoutes);
  app.use("/api/v2/service-requests", serviceRequestsRoutes);
  app.use("/api/v2/booking-operations", bookingOperationsRoutes);
  app.use("/api/v2/promotions", promotionsRoutes);
  app.use("/api/v2/employees", employeesRoutes);

  app.use("/api/payments", paymentRoutes);

  // Swagger API Documentation
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Hotel Booking API Documentation",
    }),
  );

  app.get("/v3/api-docs", (req, res) => {
    res.json(specs);
  });

  app.get("/api-docs.json", (req, res) => {
    res.json(specs);
  });

  app.get("/openapi/custom.json", (req, res) => {
    res.json(customOpenApi);
  });

  app.use(
    "/openapi",
    swaggerUi.serve,
    swaggerUi.setup(null as any, {
      swaggerUrl: "/openapi/custom.json",
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Custom OpenAPI Documentation",
    }),
  );

  return app;
}

