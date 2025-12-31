import express, { Request, Response } from "express";
import User from "../../models/user";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import verifyToken from "../middleware/auth";
import { roleCheck } from "../middleware/roleCheck"; // viết ra để check role
import * as userController from "../controllers/user.controller";


// tạo router instance từ express.Router()
// Router = object-> để định nghĩa các routes 
const router = express.Router();


//======================================================
// GET /api/users/me - lấy thông tin user hiện tại
router.get(
  "/me",                       
   verifyToken,                    // middleware 1: Kiểm tra JWT token, set req.userId 
  userController.getCurrentUser
); // xử lý logic và trả response

//======================================================
// POST /api/users/register - đăng ký user mới
router.post(
  "/register",                          // Path: /api/users/register
  [
    // Validation rules: email phải là email hợp lệ, password phải có ít nhất 6 ký tự

    check("firstName", "First name is required").notEmpty(),
    check("lastName", "Last name is required").notEmpty(),
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({
      min: 6,
    }),
  ],

  //Custom Validation middleware: Xử lý kết quả validation
  (req, res, next) => {


    const errors = validationResult(req); // lấy danh sách lỗi từ validation

      // Nếu có lỗi validation
      if (!errors.isEmpty()) {
        // Trả về lỗi 400 và dừng (không gọi next())
        return res.status(400).json({ message: errors.array() });
      }

      next(); // tiếp tục xử lsy request
  },

  userController.registerUser
);

//======================================================
// GET /api/users - Lấy danh sách tất cả users (Owner only)
router.get(
  "/",
  verifyToken,
  roleCheck(["hotel_owner"]),
  userController.getAllUsers
);

//======================================================
// GET /api/users/:id - Lấy thông tin một user cụ thể (Owner only)
router.get(
  "/:id",
  verifyToken,
  roleCheck(["hotel_owner"]),
  userController.getUserById
);

//======================================================
// PATCH /api/users/:id - Cập nhật user (Owner only)
router.patch(
  "/:id",
  verifyToken,
  roleCheck(["hotel_owner"]),
  userController.updateUser
);

//======================================================
// DELETE /api/users/:id - Soft delete user (Owner only)
router.delete(
  "/:id",
  verifyToken,
  roleCheck(["hotel_owner"]),
  userController.deleteUser
);

//======================================================
// PATCH /api/users/:id/activate - Kích hoạt lại user (Owner only)
router.patch(
  "/:id/activate",
  verifyToken,
  roleCheck(["hotel_owner"]),
  userController.activateUser
);

export default router;