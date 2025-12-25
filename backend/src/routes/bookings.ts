import express from "express";
import verifyToken from "../middleware/auth";
import { body, validationResult } from "express-validator";
import * as bookingController from "../controllers/booking.controller";

const router = express.Router();

// Get all bookings (admin only)
router.get("/", verifyToken, bookingController.getAllBookings);

// Get bookings by hotel ID (for hotel owners)
router.get(
  "/hotel/:hotelId",
  verifyToken,
  bookingController.getBookingsByHotel
);

// Get booking by ID
router.get("/:id", verifyToken, bookingController.getBookingById);

// Update booking status
router.patch(
  "/:id/status",
  verifyToken,
  [
    body("status")
      .isIn(["pending", "confirmed", "cancelled", "completed", "refunded"])
      .withMessage("Invalid status"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  bookingController.updateBookingStatus
);

// Update payment status
router.patch(
  "/:id/payment",
  verifyToken,
  [
    body("paymentStatus")
      .isIn(["pending", "paid", "failed", "refunded"])
      .withMessage("Invalid payment status"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  bookingController.updatePaymentStatus
);

// Delete booking (admin only)
router.delete("/:id", verifyToken, bookingController.deleteBooking);

export default router;
