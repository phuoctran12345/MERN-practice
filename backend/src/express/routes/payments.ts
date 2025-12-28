import express, { Request, Response } from "express";
import { verifyWebhook } from "../../services/payos.service";
import Booking from "../../models/booking";

const router = express.Router();

// ============================================
// POST /api/payments/webhook
// Webhook endpoint (PayOS sẽ gọi khi có thay đổi trạng thái thanh toán)
// ============================================
router.post("/webhook", async (req: Request, res: Response) => {
  try {
    // B1: Verify webhook data
    const isValid = verifyWebhook(req.body);
    
    if (!isValid) {
      console.error("❌ Webhook data không hợp lệ");
      return res.status(400).json({ message: "Invalid webhook data" });
    }

    const { data } = req.body;
    const { orderCode, status } = data;

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

