import { Request, Response } from "express";
import User from "../../models/user";
import UserType from "../../models/user";
import Hotel from "../../models/hotel";
import Booking from "../../models/booking";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { getIO } from "../../shared/socket";
//======================================================
// GET /api/users/me - lấy thông tin user hiện tại
export const getCurrentUser = async (req: Request, res: Response) => {


    const userId = req.userId;

    try {
        const user = await User.findById(userId).select("-password"); // loại bỏ password khỏi kết quả - select("-password") -> vì trả lên client thì không trả về password được.
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // trả về user
        res.json(user);
    } catch (error){
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

//======================================================
// POST /api/users/register - đăng ký user mới
export const registerUser = async (req: Request, res: Response) => {
    try {
        // B1: Check email đã tồn tại hay chưa.
        let user = await User.findOne({
            email: req.body.email, // req.body.email -> Email từ react form đăng ký gửi về và lưu vào database.
        })

        // Nếu email ĐÃ tồn tại -> trả về lỗi (không cho đăng ký trùng email)
        if (user) {
            return res.status(400).json({ message: "Email đã được sử dụng" });
        }

        // B2: Tạo user mới (email chưa tồn tại)
        // Nếu không có role trong req.body → mặc định là "user"
        const userData = {
            ...req.body,
            role: req.body.role || "user", // Mặc định role = "user" nếu không có
        };
        
        user = new User(userData); // tạo instance của user model  req.body chứa  firstName, lastName, email, password, role (optional)

        await user.save();

        // B3: Tạo JWT token sau khi đăng kí thành công 
        const token = jwt.sign(           //jww.sign -> tạo token mới
            { userId: user.id },          // trường Payload            
            process.env.JWT_SECRET_KEY as string,   //// truyền zo secret key để mã hoá token
            {
                expiresIn: "1d",
            }
        );

        // B4: Set cookie chứa token
        res.cookie("auth_token", token, {
            httpOnly: true,  // Cookie chỉ đọc được bởi server (không thể đọc bằng JavaScript)
        secure: process.env.NODE_ENV === "production",  // Chỉ gửi qua HTTPS khi production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",  // CSRF protection
        maxAge: 86400000,  // Thời gian sống của cookie (milliseconds) = 1 ngày
        path: "/",  // Cookie có hiệu lực cho toàn bộ website
        });
        return res.status(200).send({ message: "User đăng kí thành công" });
    }catch (error){
        console.log(error);
        res.status(500).json({ message: "Lỗi đăng kí user" });
    }

}

//======================================================
// GET /api/users - Lấy danh sách tất cả users (Owner only)
// MỤC ĐÍCH: Owner xem overview tất cả users đã sử dụng trong hệ thống
// LOGIC:
// - Nếu có companyId và role = "user" → chỉ lấy customers đã đặt phòng ở hotels của công ty đó
// - Nếu có companyId nhưng không có role → chỉ lấy employees (manager, receptionist) cùng companyId
// - Nếu không có companyId và role = "user" → lấy tất cả customers
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const { role, isActive, page = "1", limit = "10", search, companyId } = req.query;

        // Build query
        const query: any = {};

        // ============================================
        // XỬ LÝ LOGIC CHO CUSTOMERS (role = "user")
        // ============================================
        // Nếu role = "user" và có companyId → chỉ lấy customers đã đặt phòng ở hotels của công ty đó
        if (role === "user" && companyId) {
            // B1: Lấy tất cả hotels có companyId
            const hotels = await Hotel.find({ companyId: companyId as string }).select("_id");
            const hotelIds = hotels.map((hotel) => hotel._id.toString());

            // B2: Nếu không có hotels nào → trả về mảng rỗng
            if (hotelIds.length === 0) {
                return res.status(200).json({
                    message: "Lấy danh sách users thành công",
                    users: [],
                    pagination: {
                        total: 0,
                        page: parseInt(page as string, 10),
                        limit: parseInt(limit as string, 10),
                        pages: 0,
                    },
                });
            }

            // B3: Lấy tất cả bookings có hotelId trong danh sách hotels
            const bookings = await Booking.find({
                hotelId: { $in: hotelIds },
            }).select("userId");

            // B4: Lấy danh sách userId từ bookings (loại bỏ trùng lặp)
            const customerIds = [...new Set(bookings.map((booking) => booking.userId))];

            // B5: Filter users theo danh sách customerIds
            query._id = { $in: customerIds };
            query.role = "user"; // Đảm bảo chỉ lấy customers
        } else if (role) {
            // Nếu có role cụ thể (không phải "user" hoặc không có companyId)
            query.role = role;
        } else if (companyId) {
            // Nếu có companyId nhưng không có role → chỉ lấy employees (manager, receptionist)
            // KHÔNG lấy customers (role = "user")
            query.role = { $in: ["manager", "receptionist", "hotel_owner"] };
        }

        // Filter by companyId (cho employees cùng công ty)
        if (companyId && role !== "user") {
            query.companyId = companyId;
        }

        // Filter by isActive
        if (isActive !== undefined) {
            query.isActive = isActive === "true";
        }

        // Search by name or email
        if (search) {
            query.$or = [
                { firstName: { $regex: search as string, $options: "i" } },
                { lastName: { $regex: search as string, $options: "i" } },
                { email: { $regex: search as string, $options: "i" } },
            ];
        }

        // Pagination
        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);
        const skip = (pageNum - 1) * limitNum;

        // Get total count for pagination
        const total = await User.countDocuments(query);

        // Get users (exclude password)
        const users = await User.find(query)
            .select("-password")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .exec();

        res.status(200).json({
            message: "Lấy danh sách users thành công",
            users,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                pages: Math.ceil(total / limitNum),
            },
        });
    } catch (error) {
        console.error("❌ Lỗi getAllUsers:", error);
        res.status(500).json({
            message: "Lỗi khi lấy danh sách users",
            error: error instanceof Error ? error.message : String(error),
        });
    }
};

//======================================================
// GET /api/users/:id - Lấy thông tin một user cụ thể (Owner only)
export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id).select("-password");
        
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy user với ID này" });
        }

        res.status(200).json({
            message: "Lấy thông tin user thành công",
            user,
        });
    } catch (error) {
        console.error("❌ Lỗi getUserById:", error);
        res.status(500).json({
            message: "Lỗi khi lấy thông tin user",
            error: error instanceof Error ? error.message : String(error),
        });
    }
};

//======================================================
// PATCH /api/users/:id - Cập nhật user (Owner only)
export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Không cho phép update password ở đây (dùng route riêng)
        delete updateData.password;

        const user = await User.findByIdAndUpdate(
            id,
            { ...updateData, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy user với ID này" });
        }

        // Emit socket event
        try {
            const io = getIO();
            io.emit("user:updated", {
                user,
                message: "User updated successfully",
            });
            console.log("📡 Socket.IO: Emitted user:updated event");
        } catch (error) {
            console.warn("⚠️  Socket.IO not available:", error);
        }

        res.status(200).json({
            message: "Cập nhật user thành công",
            user,
        });
    } catch (error) {
        console.error("❌ Lỗi updateUser:", error);
        res.status(500).json({
            message: "Lỗi khi cập nhật user",
            error: error instanceof Error ? error.message : String(error),
        });
    }
};

//======================================================
// DELETE /api/users/:id - Soft delete user (Owner only)
// Thực tế là deactivate (set isActive = false)
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy user với ID này" });
        }

        // Soft delete - chỉ deactivate
        const deactivatedUser = await User.findByIdAndUpdate(
            id,
            { isActive: false, updatedAt: new Date() },
            { new: true }
        ).select("-password");

        // Emit socket event
        try {
            const io = getIO();
            io.emit("user:deleted", {
                userId: id,
                user: deactivatedUser,
                message: "User deactivated successfully",
            });
            console.log("📡 Socket.IO: Emitted user:deleted event");
        } catch (error) {
            console.warn("⚠️  Socket.IO not available:", error);
        }

        res.status(200).json({
            message: `Vô hiệu hóa user với ID ${id} thành công (soft delete)`,
        });
    } catch (error) {
        console.error("❌ Lỗi deleteUser:", error);
        res.status(500).json({
            message: "Lỗi khi xóa user",
            error: error instanceof Error ? error.message : String(error),
        });
    }
};

//======================================================
// PATCH /api/users/:id/password - Đổi mật khẩu user (Owner only)
export const updateUserPassword = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({
                message: "Mật khẩu mới phải có ít nhất 6 ký tự",
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                message: "Không tìm thấy user với ID này",
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 8);

        await User.findByIdAndUpdate(id, {
            password: hashedPassword,
            updatedAt: new Date(),
        });

        res.status(200).json({
            message: "Đổi mật khẩu user thành công",
        });
    } catch (error) {
        console.error("❌ Lỗi updateUserPassword:", error);
        res.status(500).json({
            message: "Lỗi khi đổi mật khẩu user",
            error: error instanceof Error ? error.message : String(error),
        });
    }
};

//======================================================
// PATCH /api/users/:id/activate - Kích hoạt lại user (Owner only)
export const activateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndUpdate(
            id,
            { isActive: true, updatedAt: new Date() },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy user với ID này" });
        }

        // Emit socket event
        try {
            const io = getIO();
            io.emit("user:activated", {
                user,
                message: "User activated successfully",
            });
            console.log("📡 Socket.IO: Emitted user:activated event");
        } catch (error) {
            console.warn("⚠️  Socket.IO not available:", error);
        }

        res.status(200).json({
            message: "Kích hoạt user thành công",
            user,
        });
    } catch (error) {
        console.error("❌ Lỗi activateUser:", error);
        res.status(500).json({
            message: "Lỗi khi kích hoạt user",
            error: error instanceof Error ? error.message : String(error),
        });
    }
};