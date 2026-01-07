import express, { Request, Response } from "express";
import { verifyWebhook } from "../../services/payos.service";
import Booking from "../../models/booking";
import verifyToken from "../middleware/auth";
import * as paymentController from "../controllers/payment.controller";
import { param, query } from "express-validator";

const router = express.Router();

// ============================================
// GET /api/payments
// Lấy danh sách tất cả giao dịch thanh toán
// ============================================
router.get(
  "/",
  verifyToken,
  [
    query("status").optional().isString(),
    query("paymentStatus").optional().isString(),
    query("hotelId").optional().isString(),
    query("userId").optional().isString(),
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
  ],
  paymentController.getAllPayments
);

// ============================================
// GET /api/payments/statistics
// Lấy thống kê giao dịch thanh toán
// ============================================
router.get(
  "/statistics",
  verifyToken,
  [
    query("startDate").optional().isISO8601(),
    query("endDate").optional().isISO8601(),
    query("hotelId").optional().isString(),
  ],
  paymentController.getPaymentStatistics
);

// ============================================
// GET /api/payments/:orderCode
// Lấy chi tiết một giao dịch thanh toán theo orderCode
// ============================================
router.get(
  "/:orderCode",
  verifyToken,
  [param("orderCode").notEmpty().withMessage("orderCode là bắt buộc")],
  paymentController.getPaymentByOrderCode
);

// ============================================
// POST /api/payments/webhook
// Webhook endpoint (PayOS sẽ gọi khi có thay đổi trạng thái thanh toán)
// ⚠️ KHÔNG CẦN verifyToken vì PayOS gọi từ bên ngoài
// ============================================
router.post("/webhook", async (req: Request, res: Response) => {
  try {
    // B1: Verify webhook data (sử dụng API chính thức)
    const verifiedData = verifyWebhook(req.body);
    
    if (!verifiedData) {
      console.error("❌ Webhook data không hợp lệ");
      return res.status(400).json({ message: "Invalid webhook data" });
    }

    // verifiedData có thể là Promise hoặc object tuỳ theo hàm verifyWebhook
    // Đảm bảo await nếu verifyWebhook trả về Promise
    const { data } = await verifiedData as any;
    // Hoặc nếu verifyWebhook chắc chắn trả ra object (không phải Promise) thì bỏ await
    // const { data } = verifiedData;

    // Destructure thông tin từ data mà PayOS trả về (orderCode, status)
    const { orderCode, status } = data;

    // Log nhận webhook cho dev kiểm tra
    console.log(`📢 Webhook nhận được: orderCode=${orderCode}, status=${status}`);


    // B2: Cập nhật trạng thái booking
    if (status === "PAID") {
      const booking = await Booking.findOneAndUpdate(
        { orderCode: orderCode },
        { 
          status: "confirmed",
          paymentStatus: "paid",
        },
        { new: true }
      );

      if (booking) {
        console.log(`✅ Đã cập nhật booking ${booking._id} thành công`);
      } else {
        console.log(`⚠️ Không tìm thấy booking với orderCode: ${orderCode}`);
      }
    } else if (status === "CANCELLED") {
      await Booking.findOneAndUpdate(
        { orderCode: orderCode },
        { 
          status: "cancelled",
          paymentStatus: "failed",
        }
      );
    }

    // B3: Trả về success cho PayOS
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Lỗi webhook:", error);
    res.status(500).json({ 
      message: "Webhook error",
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;

