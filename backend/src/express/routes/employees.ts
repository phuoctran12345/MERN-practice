import express from "express";
import verifyToken from "../middleware/auth";
import { roleCheck } from "../middleware/roleCheck";
import * as employeeController from "../controllers/employee.controller";
import { body, param, query } from "express-validator";

const router = express.Router();

// ============================================
// POST /api/v2/employees
// Tạo nhân viên mới (Manager)
router.post(
  "/",
  verifyToken,
  roleCheck(["manager"]),
  [
    body("email").isEmail().withMessage("Email không hợp lệ"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Mật khẩu phải có ít nhất 6 ký tự"),
    body("firstName").notEmpty().withMessage("Tên là bắt buộc"),
    body("lastName").notEmpty().withMessage("Họ là bắt buộc"),
    body("role")
      .isIn(["receptionist", "manager", "hotel_owner"])
      .withMessage("Role phải là receptionist, manager hoặc hotel_owner"),
    body("phone").optional().isString(),
    body("companyId").optional().isString(),
    body("isActive").optional().isBoolean(),
    body("emailVerified").optional().isBoolean(),
  ],
  employeeController.createEmployee
);

// ============================================
// GET /api/v2/employees
// Lấy danh sách nhân viên với filters và pagination (Manager)
router.get(
  "/",
  verifyToken,
  roleCheck(["manager"]),
  [
    query("companyId").optional().isString(),
    query("role").optional().isIn(["receptionist", "manager", "hotel_owner"]),
    query("isActive").optional().isBoolean(),
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
  ],
  employeeController.getAllEmployees
);

// ============================================
// GET /api/v2/employees/role/:role
// Lấy danh sách nhân viên theo role (Manager)
router.get(
  "/role/:role",
  verifyToken,
  roleCheck(["manager"]),
  [
    param("role").isIn(["receptionist", "manager", "hotel_owner"]),
    query("companyId").optional().isString(),
  ],
  employeeController.getEmployeesByRole
);

// ============================================
// GET /api/v2/employees/:id
// Lấy thông tin một nhân viên cụ thể (Manager)
router.get(
  "/:id",
  verifyToken,
  roleCheck(["manager"]),
  [param("id").notEmpty().withMessage("Employee ID là bắt buộc")],
  employeeController.getEmployeeById
);

// ============================================
// PATCH /api/v2/employees/:id
// Cập nhật nhân viên (Manager)
router.patch(
  "/:id",
  verifyToken,
  roleCheck(["manager"]),
  [
    param("id").notEmpty().withMessage("Employee ID là bắt buộc"),
    body("email").optional().isEmail(),
    body("firstName").optional().notEmpty(),
    body("lastName").optional().notEmpty(),
    body("role").optional().isIn(["receptionist", "manager", "hotel_owner"]),
    body("phone").optional().isString(),
    body("companyId").optional().isString(),
    body("isActive").optional().isBoolean(),
    body("emailVerified").optional().isBoolean(),
  ],
  employeeController.updateEmployee
);

// ============================================
// DELETE /api/v2/employees/:id
// Xóa (deactivate) nhân viên (Manager)
router.delete(
  "/:id",
  verifyToken,
  roleCheck(["manager"]),
  [param("id").notEmpty().withMessage("Employee ID là bắt buộc")],
  employeeController.deleteEmployee
);

// ============================================
// PATCH /api/v2/employees/:id/password
// Đổi mật khẩu nhân viên (Manager)
router.patch(
  "/:id/password",
  verifyToken,
  roleCheck(["manager"]),
  [
    param("id").notEmpty().withMessage("Employee ID là bắt buộc"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("Mật khẩu mới phải có ít nhất 6 ký tự"),
  ],
  employeeController.updateEmployeePassword
);

// ============================================
// PATCH /api/v2/employees/:id/activate
// Kích hoạt nhân viên (Manager)
router.patch(
  "/:id/activate",
  verifyToken,
  roleCheck(["manager"]),
  [param("id").notEmpty().withMessage("Employee ID là bắt buộc")],
  employeeController.activateEmployee
);

export default router;

