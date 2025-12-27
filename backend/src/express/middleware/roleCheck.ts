import { Request, Response, NextFunction } from "express";

/**
 * MIDDLEWARE: roleCheck
 * MỤC ĐÍCH: Kiểm tra quyền truy cập dựa trên role của user
 * SỬ DỤNG: roleCheck(['admin', 'manager', 'receptionist'])
 */
export const roleCheck = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Lấy user từ request (đã được set bởi verifyToken middleware)
      const user = (req as any).user;
      
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
