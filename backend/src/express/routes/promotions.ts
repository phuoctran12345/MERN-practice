import express from "express";
import verifyToken from "../middleware/auth";
import { roleCheck } from "../middleware/roleCheck";
import * as promotionController from "../controllers/promotion.controller";
import { body, param, query } from "express-validator";   // validate dữ liệu input từ client

const router = express.Router();

// ============================================
// POST /api/v2/promotions
// Tạo khuyến mãi mới (Manager hoặc Owner)
router.post(
  "/",
  verifyToken,
  roleCheck(["manager", "hotel_owner"]),
  [
    body("name").notEmpty().withMessage("Tên khuyến mãi là bắt buộc"),
    body("description").notEmpty().withMessage("Mô tả là bắt buộc"),
    body("discountType")
      .isIn(["PERCENTAGE", "FIXED_AMOUNT"])
      .withMessage("Loại giảm giá phải là PERCENTAGE hoặc FIXED_AMOUNT"),
    body("discountValue")
      .isFloat({ min: 0 })
      .withMessage("Giá trị giảm giá phải >= 0"),
    body("startDate").isISO8601().withMessage("Ngày bắt đầu không hợp lệ"),
    body("endDate").isISO8601().withMessage("Ngày kết thúc không hợp lệ"),
    body("hotelId").optional().isString(),
    body("minStay").optional().isInt({ min: 1 }),
    body("maxUsage").optional().isInt({ min: 1 }),
    body("isActive").optional().isBoolean(),
  ],
  promotionController.createPromotion // tại đây bắn một phát về BE
);

// ============================================
// GET /api/v2/promotions
// Lấy danh sách khuyến mãi với filters (Manager hoặc Owner)
router.get(
  "/",
  verifyToken,
  roleCheck(["manager", "hotel_owner"]),
  [
    query("hotelId").optional().isString(),
    query("isActive").optional().isBoolean(),
    query("currentDate").optional().isISO8601(),
  ],
  promotionController.getAllPromotions //GỌI lên FE
);

// ============================================
// GET /api/v2/promotions/active
// Lấy danh sách khuyến mãi đang hoạt động (Public - không cần auth)
router.get(
  "/active",
  [
    query("hotelId").optional().isString(),
  ],
  promotionController.getActivePromotions //GỌI lên FE
);

// ============================================
// GET /api/v2/promotions/:id
// Lấy thông tin một khuyến mãi cụ thể
router.get(
  "/:id",
  [param("id").notEmpty().withMessage("Promotion ID là bắt buộc")],
  promotionController.getPromotionById
);

// ============================================
// PATCH /api/v2/promotions/:id
// Cập nhật khuyến mãi (Manager hoặc Owner)
router.patch(
  "/:id",
  verifyToken,
  roleCheck(["manager", "hotel_owner"]),
  [
    param("id").notEmpty().withMessage("Promotion ID là bắt buộc"),
    body("name").optional().notEmpty(),
    body("description").optional().notEmpty(),
    body("discountType").optional().isIn(["PERCENTAGE", "FIXED_AMOUNT"]),
    body("discountValue").optional().isFloat({ min: 0 }),
    body("startDate").optional().isISO8601(),
    body("endDate").optional().isISO8601(),
    body("hotelId").optional().isString(),
    body("minStay").optional().isInt({ min: 1 }),
    body("maxUsage").optional().isInt({ min: 1 }),
    body("isActive").optional().isBoolean(),
  ],
  promotionController.updatePromotion
);

// ============================================
// DELETE /api/v2/promotions/:id
// Xóa khuyến mãi (Manager)
router.delete(
  "/:id",
  verifyToken,
  roleCheck(["manager"]),
  [param("id").notEmpty().withMessage("Promotion ID là bắt buộc")],
  promotionController.deletePromotion
);

// ============================================
// POST /api/v2/promotions/:id/increment-usage
// Tăng số lần sử dụng khuyến mãi
router.post(
  "/:id/increment-usage",
  verifyToken,
  [param("id").notEmpty().withMessage("Promotion ID là bắt buộc")],
  promotionController.incrementPromotionUsage
);

export default router;

