import "dotenv/config";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import userRoutes from "./src/express/routes/users";
import authRoutes from "./src/express/routes/auth";
import cookieParser from "cookie-parser";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import myHotelRoutes from "./src/express/routes/my-hotels";
import hotelRoutes from "./src/express/routes/hotels";
import bookingRoutes from "./src/express/routes/my-bookings";
import bookingsManagementRoutes from "./src/express/routes/bookings";
import healthRoutes from "./src/express/routes/health";
import businessInsightsRoutes from "./src/express/routes/business-insights";
import swaggerUi from "swagger-ui-express";
import { specs } from "./src/shared/swagger";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import cors, { CorsOptions } from "cors";

//=======================================================================
// Kiểm tra biến môi trường (ENV)
// đảm bảo các biến quan trọng phải có trước khi khởi động server
const requiredEnvVars = [
    "MONGODB_CONNECTION_STRING",
  "JWT_SECRET_KEY",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "STRIPE_API_KEY",
];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
 
if (missingEnvVars.length > 0) {
    console.error("Thiếu các biến môi trường bắt buộc");
    missingEnvVars.forEach((envVar) => console.error(`- ${envVar}`));
    process.exit(1); // dừng ứng dụng ngay lập tức
}

console.log("✅ Tất cả biến môi trường đã sẵn sàng");
console.log(`🌍 Môi trường: ${process.env.NODE_ENV || "development"}`);
console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || "Not set"}`);


//=======================================================================
// -- CẤU HÌNH CLOUDINARY --
// dùng để quản lý và lưu trữ hình ảnh khách sạn
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  
  console.log("☁️  Cloudinary đã cấu hình xong");


//=======================================================================
// -- KẾT NỐI CƠ SỞ DỮ LIỆU MONGODB --
const connectDB = async () => {

    try {
        console.log("🔌 Kết nối đến MongoDB...");
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
        console.log("✅ Kết nối thành công!");
        console.log(`💾 Database: ${mongoose.connection.name}`);
        console.log(`📦 Collections: ${mongoose.connection.collections.length}`);
    } catch (error) {
        console.error("❌ Lỗi kết nối MongoDB:", error);
        process.exit(1); // dừng ứng dụng ngay lập tức
    }
}

// Theo dõi các sự kiến của kết nối MongoDB
mongoose.connection.on("connected", () => {
    console.log("🔗 MongoDB đã kết nối thành công");
});

mongoose.connection.on("error", (error) => {
    console.error("❌ Lỗi kết nối MongoDB:", error);
    process.exit(1); // dừng ứng dụng ngay lập tức
});

mongoose.connection.on("disconnected", () => {
    console.log("🔗 MongoDB đã ngắt kết nối");
});

connectDB();


//=======================================================================
// MIDDLEWARE BẢO MÂTH & GIA TĂNG HIỆU SUẤT

const app = express();

app.use(helmet());  // bảo vệ ứng dụng khỏi các lỗ hổng web phổ biến

app.set("trust proxy", 1); // Cần thiết khi triển khai lên Render/Heroku để lấy IP thật của user


// Giới hạn số lượng request (Rate Limiting)
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 200, // Tối đa 200 requests/IP
    message: "Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau.",
    standardHeaders: true,
    legacyHeaders: false,
})



// Giới hạn riêng cho thanh toán (chặt chẽ hơn để tránh spam)
const paymentLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: "Quá nhiều yêu cầu thanh toán, vui lòng thử lại sau.",
    standardHeaders: true,
    legacyHeaders: false,
  });
  


  app.use("/api/", generalLimiter);
  app.use("/api/hotels/*/bookings/payment-intent", paymentLimiter);

  app.use(compression()); // nén response để giảm kích thước và tăng tốc độ truyền tải
  app.use(morgan(
    "combined" // log các request HTTP ra console
  ))


  //=======================================================================
// -- CẤU HÌNH CORS (cho phép Frontend truy cập )
const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5174",
    "http://localhost:5173",
    "https://mern-booking-hotel.netlify.app",
  ].filter((origin): origin is string => Boolean(origin));


const corsOptions: CorsOptions = {
    origin: (origin: any , callback: any ) => {
        // cho phép các request không có origin ( Như Postmam /Mobile app) hoặc từ nestify
        if (!origin || origin.includes("netlify.app") || allowedOrigins.includes(origin)) {
            return callback(null , true);
        }
        return callback(new Error("Bị chặn bởi CORS"));
    },
    credentials: true,  // Cho phép gửi cookie/token
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Xử lý các request OPTIONS (preflight)

app.use(cookieParser()); // Đọc cookie từ request
app.use(express.json()); // Phân tích dữ liệu JSON trong body
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header("Vary", "Origin"); // Hỗ trợ cache khi dùng CORS
  next();
});

//=======================================================================
// -- CÁC ROUTE ĐIỀU HƯỚNG --
app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Hotel Booking Backend API is running 🚀</h1>");
});

app.use("/api/auth", authRoutes);                                               // Đăng nhập, đăng xuất
app.use("/api/users", userRoutes);                                              // Quản lý người dùng
app.use("/api/my-hotels", myHotelRoutes);                                       // Khách sạn của tôi (dành cho chủ KS) -- dùng 
app.use("/api/hotels", hotelRoutes);                                            // Tìm kiếm & xem khách sạn
app.use("/api/my-bookings", bookingRoutes);                                     // Đơn đặt phòng của tôi
app.use("/api/bookings", bookingsManagementRoutes);                             // Quản lý đặt phòng (admin)
app.use("/api/health", healthRoutes);                                           // Kiểm tra trạng thái hệ thống
app.use("/api/business-insights", businessInsightsRoutes);                      // Thống kê kinh doanh

//=======================================================================
// --- TÀI LIỆU API (SWAGGER) ---
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Hotel Booking API Documentation",
    })
  );

  //=======================================================================
  // --- KHỞI CHẠY SERVER ---
const PORT = process.env.PORT || 7002;

const server = app.listen(PORT, () => {
  console.log("🚀 ============================================");
  console.log(`✅ Server đang chạy tại cổng: ${PORT}`);
  console.log(`🌐 Local: http://localhost:${PORT}`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
  console.log("🚀 ============================================");
});



// --- XỬ LÝ ĐÓNG SERVER AN TOÀN (GRACEFUL SHUTDOWN) ---
// đóng kết nối đúng cách, không làm mất dữ liệu
const gracefulShutdown = (signal: string) => {

  console.log(`\n⚠️  ${signal} đã nhận được thông báo đóng server...`);

  server.close(async() => {

    console.log("🛑 Server đã đóng");

    try {
        await mongoose.connection.close();
        console.log("💾 MongoDB đã đóng kết nối");
    } catch (error) {
         // Nếu có lỗi khi đóng
      console.error("❌ Error during shutdown:", error);
      // Thoát với mã lỗi (1)
      process.exit(1);
    } finally {
        console.log("🏁 Server đã đóng xong, cảnh báo các process con");
        process.kill(process.pid, signal);  
    }

  })
}



// ============================================
// PHẦN 17: XỬ LÝ SỰ KIỆN PROCESS
// ============================================

// Lắng nghe sự kiện SIGTERM (terminate signal)
// Thường được gửi bởi process manager (PM2, systemd...)
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// Lắng nghe sự kiện SIGINT (interrupt signal)
// Thường được gửi khi nhấn Ctrl+C trong terminal
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Lắng nghe sự kiện uncaughtException
// Xảy ra khi có lỗi không được bắt (không có try-catch)
// Ví dụ: undefined.toString() → crash server
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  gracefulShutdown("UNCAUGHT_EXCEPTION");
});

// Lắng nghe sự kiện unhandledRejection
// Xảy ra khi Promise bị reject nhưng không có .catch()
// Ví dụ: await mongoose.connect() fail nhưng không có try-catch
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  gracefulShutdown("UNHANDLED_REJECTION");
});

