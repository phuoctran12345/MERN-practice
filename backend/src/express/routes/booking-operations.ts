import express from "express";
import * as bookingOperationsController from "../controllers/booking-operations.controller";
import { body } from "express-validator";

const router = express.Router();

// ============================================
// POST /api/v2/booking-operations/check-in
// Thực hiện check-in
router.post(
  "/check-in",
  [
    body("bookingId").notEmpty().withMessage("bookingId là bắt buộc"),
    body("roomId").optional().isString(),
  ],
  bookingOperationsController.checkIn
);

// ============================================
// POST /api/v2/booking-operations/check-out
// Thực hiện check-out
router.post(
  "/check-out",
  [
    body("bookingId").notEmpty().withMessage("bookingId là bắt buộc"),
    body("extraCharges").optional().isFloat({ min: 0 }).withMessage("extraCharges phải >= 0"),
    body("notes").optional().isString().withMessage("notes phải là string"),
    body("paymentMethod")
      .optional()
      .isIn(["cash", "card"])
      .withMessage("paymentMethod phải là 'cash' hoặc 'card'"),
  ],
  bookingOperationsController.checkOut
);

export default router;

