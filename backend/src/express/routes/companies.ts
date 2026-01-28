import express from "express";
import { body, param, query } from "express-validator";
import verifyToken from "../middleware/auth";
import * as companyController from "../controllers/company.controller";

const router = express.Router();

// Validation middleware
const validateRequest = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { validationResult } = require("express-validator");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// ============================================
// POST /api/companies
// Tạo công ty mới (có thể cần authentication tùy yêu cầu)
router.post(
  "/",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Tên công ty là bắt buộc")
      .isLength({ min: 2, max: 200 })
      .withMessage("Tên công ty phải từ 2 đến 200 ký tự"),
    body("taxId")
      .trim()
      .notEmpty()
      .withMessage("Mã số thuế là bắt buộc")
      .isLength({ min: 10, max: 15 })
      .withMessage("Mã số thuế phải từ 10 đến 15 ký tự"),
    body("address")
      .trim()
      .notEmpty()
      .withMessage("Địa chỉ là bắt buộc")
      .isLength({ min: 5, max: 500 })
      .withMessage("Địa chỉ phải từ 5 đến 500 ký tự"),
    body("representative")
      .trim()
      .notEmpty()
      .withMessage("Người đại diện là bắt buộc")
      .isLength({ min: 2, max: 100 })
      .withMessage("Tên người đại diện phải từ 2 đến 100 ký tự"),
    body("phone")
      .optional()
      .trim()
      .matches(/^[0-9+\-\s()]+$/)
      .withMessage("Số điện thoại không hợp lệ"),
    body("email")
      .optional()
      .trim()
      .isEmail()
      .withMessage("Email không hợp lệ"),
    body("isActive")
      .optional()
      .isBoolean()
      .withMessage("isActive phải là boolean"),
  ],
  validateRequest,
  companyController.createCompany
);

// ============================================
// GET /api/companies
// Lấy danh sách công ty với filters và pagination
router.get(
  "/",
  [
    query("isActive")
      .optional()
      .isIn(["true", "false"])
      .withMessage("isActive phải là 'true' hoặc 'false'"),
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page phải là số nguyên dương"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit phải từ 1 đến 100"),
    query("search")
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage("Search query không được vượt quá 100 ký tự"),
  ],
  validateRequest,
  companyController.getAllCompanies
);

// ============================================
// GET /api/companies/:id
// Lấy thông tin một công ty cụ thể
router.get(
  "/:id",
  [
    param("id")
      .notEmpty()
      .withMessage("Company ID là bắt buộc")
      .isMongoId()
      .withMessage("Company ID không hợp lệ"),
  ],
  validateRequest,
  companyController.getCompanyById
);

// ============================================
// PATCH /api/companies/:id
// Cập nhật công ty
router.patch(
  "/:id",
  [
    param("id")
      .notEmpty()
      .withMessage("Company ID là bắt buộc")
      .isMongoId()
      .withMessage("Company ID không hợp lệ"),
    body("name")
      .optional()
      .trim()
      .isLength({ min: 2, max: 200 })
      .withMessage("Tên công ty phải từ 2 đến 200 ký tự"),
    body("taxId")
      .optional()
      .trim()
      .isLength({ min: 10, max: 15 })
      .withMessage("Mã số thuế phải từ 10 đến 15 ký tự"),
    body("address")
      .optional()
      .trim()
      .isLength({ min: 5, max: 500 })
      .withMessage("Địa chỉ phải từ 5 đến 500 ký tự"),
    body("representative")
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage("Tên người đại diện phải từ 2 đến 100 ký tự"),
    body("phone")
      .optional()
      .trim()
      .matches(/^[0-9+\-\s()]+$/)
      .withMessage("Số điện thoại không hợp lệ"),
    body("email")
      .optional()
      .trim()
      .isEmail()
      .withMessage("Email không hợp lệ"),
    body("isActive")
      .optional()
      .isBoolean()
      .withMessage("isActive phải là boolean"),
  ],
  validateRequest,
  companyController.updateCompany
);

// ============================================
// DELETE /api/companies/:id
// Xóa công ty (deactivate)
router.delete(
  "/:id",
  [
    param("id")
      .notEmpty()
      .withMessage("Company ID là bắt buộc")
      .isMongoId()
      .withMessage("Company ID không hợp lệ"),
  ],
  validateRequest,
  companyController.deleteCompany
);

// ============================================
// PATCH /api/companies/:id/activate
// Kích hoạt công ty
router.patch(
  "/:id/activate",
  [
    param("id")
      .notEmpty()
      .withMessage("Company ID là bắt buộc")
      .isMongoId()
      .withMessage("Company ID không hợp lệ"),
  ],
  validateRequest,
  companyController.activateCompany
);

export default router;
