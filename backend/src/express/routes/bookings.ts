import express from "express";
import verifyToken from "../middleware/auth";
import { roleCheck } from "../middleware/roleCheck";
import * as bookingController from "../controllers/booking.controller";
import { body } from "express-validator";

const router = express.Router();

// ============================================
// GET /api/bookings
// Xem tất cả bookings (Receptionist, Manager và Hotel Owner)
router.get(
  "/",
  verifyToken,
  roleCheck(["receptionist", "manager", "hotel_owner"]),
  bookingController.getAllBookings
);

// ============================================
// PUT /api/bookings/:id
// Sửa đổi thông tin đặt phòng (Receptionist quản lý)
router.put(
  "/:id",
  verifyToken,
  roleCheck(["receptionist"]),
  [
    // Validation rules
    body("firstName").optional().isString().withMessage("Tên phải là chuỗi"),
    body("lastName").optional().isString().withMessage("Họ phải là chuỗi"),
    body("email").optional().isEmail().withMessage("Email không hợp lệ"),
    body("phone").optional().isString().withMessage("Số điện thoại phải là chuỗi"),
    body("adultCount").optional().isInt({ min: 1 }).withMessage("Số người lớn phải >= 1"),
    body("childCount").optional().isInt({ min: 0 }).withMessage("Số trẻ em phải >= 0"),
    body("checkIn").optional().isISO8601().withMessage("Ngày check-in không hợp lệ"),
    body("checkOut").optional().isISO8601().withMessage("Ngày check-out không hợp lệ"),
    body("totalCost").optional().isFloat({ min: 0 }).withMessage("Tổng tiền phải >= 0"),
    body("specialRequests").optional().isString().withMessage("Yêu cầu đặc biệt phải là chuỗi"),
  ],
  bookingController.updateBooking
);

// ============================================
// PATCH /api/bookings/:id/status
// Cập nhật trạng thái đặt phòng (Receptionist quản lý)
router.patch(
  "/:id/status",
  verifyToken,
  roleCheck(["receptionist"]),
  [
    body("status")
      .isIn(["pending", "confirmed", "checked_in", "completed", "cancelled", "refunded"])
      .withMessage("Trạng thái không hợp lệ"),
    body("cancellationReason")
      .optional()
      .isString()
      .withMessage("Lý do hủy phải là chuỗi"),
  ],
  bookingController.updateBookingStatus
);

export default router;