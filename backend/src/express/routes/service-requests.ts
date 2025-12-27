import express from "express";
import * as serviceRequestController from "../controllers/service-request.controller";
import { body, param, query } from "express-validator";

const router = express.Router();

// ============================================
// POST /api/v2/service-requests
// Tạo service request mới
router.post(
  "/",
  [
    body("bookingId").notEmpty().withMessage("bookingId là bắt buộc"),
    body("userId").notEmpty().withMessage("userId là bắt buộc"),
    body("hotelId").notEmpty().withMessage("hotelId là bắt buộc"),
    body("serviceType")
      .isIn(["room_service", "laundry", "cleaning", "food", "transport", "minibar", "other"])
      .withMessage("serviceType không hợp lệ"),
    body("description").notEmpty().withMessage("description là bắt buộc"),
    body("price").optional().isFloat({ min: 0 }).withMessage("price phải >= 0"),
  ],
  serviceRequestController.createServiceRequest
);

// ============================================
// GET /api/v2/service-requests?bookingId=xxx&userId=xxx&hotelId=xxx&status=xxx
// Lấy danh sách service requests
router.get("/", serviceRequestController.getAllServiceRequests);

// ============================================
// GET /api/v2/service-requests/booking/:bookingId/total
// Tính tổng chi phí dịch vụ
router.get("/booking/:bookingId/total", serviceRequestController.calculateTotalServiceCost);

// ============================================
// GET /api/v2/service-requests/:id
// Lấy thông tin một service request
router.get("/:id", [param("id").notEmpty().withMessage("Service Request ID là bắt buộc")], serviceRequestController.getServiceRequestById);

// ============================================
// PATCH /api/v2/service-requests/:id
// Cập nhật service request
router.patch(
  "/:id",
  [
    param("id").notEmpty().withMessage("Service Request ID là bắt buộc"),
    body("status").optional().isIn(["pending", "in_progress", "completed", "cancelled"]),
    body("price").optional().isFloat({ min: 0 }),
  ],
  serviceRequestController.updateServiceRequest
);

// ============================================
// DELETE /api/v2/service-requests/:id
// Xóa service request
router.delete("/:id", [param("id").notEmpty().withMessage("Service Request ID là bắt buộc")], serviceRequestController.deleteServiceRequest);

export default router;

