import express from "express";
import * as roomController from "../controllers/room.controller";
import { body, param, query } from "express-validator";

const router = express.Router();

// ============================================
// POST /api/v2/rooms
// Tạo room mới
router.post(
  "/",
  [
    body("hotelId").notEmpty().withMessage("hotelId là bắt buộc"),
    body("roomNumber").notEmpty().withMessage("roomNumber là bắt buộc"),
    body("roomType").isIn(["SINGLE", "DOUBLE", "SUITE", "DELUXE"]).withMessage("roomType không hợp lệ"),
    body("basePrice").isFloat({ min: 0 }).withMessage("basePrice phải >= 0"),
    body("maxOccupancy").isInt({ min: 1 }).withMessage("maxOccupancy phải >= 1"),
    body("status").optional().isIn(["AVAILABLE", "OCCUPIED", "MAINTENANCE", "RESERVED"]),
  ],
  roomController.createRoom
);

// ============================================
// GET /api/v2/rooms?hotelId=xxx&status=AVAILABLE
// Lấy danh sách rooms
router.get("/", roomController.getAllRooms);

// ============================================
// GET /api/v2/rooms/available?hotelId=xxx&checkIn=xxx&checkOut=xxx
// Tìm phòng trống
router.get("/available", roomController.findAvailableRooms);

// ============================================
// GET /api/v2/rooms/:id
// Lấy thông tin một room cụ thể
router.get(
  "/:id",
  [param("id").notEmpty().withMessage("Room ID là bắt buộc")],
  roomController.getRoomById
);

// ============================================
// PATCH /api/v2/rooms/:id
// Cập nhật thông tin room
router.patch(
  "/:id",
  [
    param("id").notEmpty().withMessage("Room ID là bắt buộc"),
    body("roomType").optional().isIn(["SINGLE", "DOUBLE", "SUITE", "DELUXE"]),
    body("basePrice").optional().isFloat({ min: 0 }),
    body("status").optional().isIn(["AVAILABLE", "OCCUPIED", "MAINTENANCE", "RESERVED"]),
  ],
  roomController.updateRoom
);

// ============================================
// PATCH /api/v2/rooms/:id/status
// Cập nhật status của room
router.patch(
  "/:id/status",
  [
    param("id").notEmpty().withMessage("Room ID là bắt buộc"),
    body("status").isIn(["AVAILABLE", "OCCUPIED", "MAINTENANCE", "RESERVED"]).withMessage("Status không hợp lệ"),
  ],
  roomController.updateRoomStatus
);

// ============================================
// DELETE /api/v2/rooms/:id
// Xóa room
router.delete(
  "/:id",
  [param("id").notEmpty().withMessage("Room ID là bắt buộc")],
  roomController.deleteRoom
);

export default router;

