import express from "express";
import { param, validationResult } from "express-validator";
import verifyToken from "../middleware/auth";
import * as hotelController from "../controllers/hotel.controller";

const router = express.Router();

router.get("/search", hotelController.searchHotels);

router.get("/", hotelController.getAllHotels);

router.get(
  "/:id",
  [param("id").notEmpty().withMessage("Hotel ID is required")],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  hotelController.getHotelById
);

router.post(
  "/:hotelId/bookings/payment-intent",
  verifyToken,
  hotelController.createPaymentIntent
);

router.post(
  "/:hotelId/bookings",
  verifyToken,                  // gọi thằng verifyToken ni thì phải cần JWT token 
  hotelController.createBooking // gọi thằng createBooking ni thì phải cần JWT token 
);

export default router;
