import express from "express";
import verifyToken from "../middleware/auth";
import * as myBookingsController from "../controllers/my-bookings.controller";

const router = express.Router();

// /api/my-bookings
router.get("/", verifyToken, myBookingsController.getMyBookings);

export default router;
