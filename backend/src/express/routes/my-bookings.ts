import express from "express";
import verifyToken from "../middleware/auth";
import * as myBookingsController from "../controllers/my-bookings.controller";

const router = express.Router();

// GET /api/my-bookings - Lấy danh sách đơn đặt phòng
router.get("/", verifyToken, myBookingsController.getMyBookings);

// DELETE /api/my-bookings/:id - Hủy đơn đặt phòng
router.delete("/:id", verifyToken, myBookingsController.cancelMyBooking);

export default router;
