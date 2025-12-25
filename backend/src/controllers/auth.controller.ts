// ============================================
// FILE: auth.controller.ts
// MỤC ĐÍCH: Controller xử lý business logic cho Authentication
// TRONG MVC: Đây là Controller layer
// ============================================

import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ============================================
// FUNCTION: login
// MỤC ĐÍCH: Đăng nhập user
// ENDPOINT: POST /api/auth/login
// VALIDATION: Đã được xử lý ở routes
// ============================================
export const login = async (req: Request, res: Response) => {
  try {
    // Lấy email và password từ request body
    const { email, password } = req.body;

    // Bước 1: Tìm user theo email
    const user = await User.findOne({ email });
    
    // Nếu không tìm thấy user
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Bước 2: So sánh password
    // bcrypt.compare() = So sánh password plain text với password đã hash
    // user.password = Password đã được hash trong database
    const isMatch = await bcrypt.compare(password, user.password);
    
    // Nếu password không khớp
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Bước 3: Tạo JWT token
    // jwt.sign() = Tạo token mới
    // { userId: user.id } = Payload (dữ liệu trong token)
    // process.env.JWT_SECRET_KEY = Secret key từ file .env
    // { expiresIn: "1d" } = Token hết hạn sau 1 ngày
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET_KEY as string,
      {
        expiresIn: "1d",
      }
    );

    // Bước 4: Trả về response với token
    // Trả token trong response body (để frontend lưu vào localStorage)
    res.status(200).json({
      userId: user._id,
      message: "Login successful",
      token: token, // JWT token trong response body
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// ============================================
// FUNCTION: validateToken
// MỤC ĐÍCH: Xác thực token (kiểm tra token còn hợp lệ không)
// ENDPOINT: GET /api/auth/validate-token
// MIDDLEWARE: verifyToken (đã được gọi ở routes)
// ============================================
export const validateToken = (req: Request, res: Response) => {
  // req.userId được set bởi middleware verifyToken
  // Nếu đến được đây nghĩa là token hợp lệ
  res.status(200).send({ userId: req.userId });
};

// ============================================
// FUNCTION: logout
// MỤC ĐÍCH: Đăng xuất user (xóa cookie)
// ENDPOINT: POST /api/auth/logout
// ============================================
export const logout = (req: Request, res: Response) => {
  // Xóa cookie bằng cách set cookie với giá trị rỗng và expires = 0
  res.cookie("session_id", "", {
    expires: new Date(0),  // Thời gian hết hạn = 0 (ngay lập tức)
    maxAge: 0,            // Thời gian sống = 0
    httpOnly: false,       // Cho phép JavaScript đọc (để xóa)
    secure: true,          // Chỉ gửi qua HTTPS
    sameSite: "none",      // CSRF protection
    path: "/",             // Áp dụng cho toàn bộ website
  });
  
  // Trả về response thành công
  res.send();
};

