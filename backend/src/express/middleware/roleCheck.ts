import { Request, Response, NextFunction } from "express";
import User from "../../models/user";

/**
 * MIDDLEWARE: roleCheck
 * MỤC ĐÍCH: Kiểm tra quyền truy cập dựa trên role của user
 * SỬ DỤNG: roleCheck(['hotel_owner', 'manager', 'receptionist'])
 */
export const roleCheck = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Lấy userId từ request (đã được set bởi verifyToken middleware)
      const userId = (req as any).userId;
      
      if (!userId) {
        return res.status(401).json({ message: "Không tìm thấy thông tin người dùng" });
      }

      // Lấy thông tin user từ database
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(401).json({ message: "Không tìm thấy thông tin người dùng" });
      }

      // Kiểm tra role
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ 
          message: "Bạn không có quyền truy cập chức năng này",
          requiredRoles: allowedRoles,
          userRole: user.role
        });
      }

      next();
    } catch (error) {
      console.log("Lỗi roleCheck middleware: " + error);
      res.status(500).json({ message: "Lỗi kiểm tra quyền truy cập" });
    }
  };
};
