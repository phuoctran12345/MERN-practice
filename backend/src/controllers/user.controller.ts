import { Request, Response } from "express";
import User from "../models/user";
import { UserType } from "../../../shared/types";
import jwt from "jsonwebtoken";
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

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // B2: Tạo user mới 
        user = new User(req.body); // tạo instance của user model  req.body chứa  firstName, lastName, email, password

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