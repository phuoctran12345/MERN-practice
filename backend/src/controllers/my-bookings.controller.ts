// ============================================
// FILE: my-bookings.controller.ts
// MỤC ĐÍCH: Controller xử lý business logic cho My Bookings (Bookings của user)
// TRONG MVC: Đây là Controller layer
// ============================================

import { Request, Response } from "express";
import Hotel from "../models/hotel";
import Booking from "../models/booking";

// ============================================
// FUNCTION: getMyBookings
// MỤC ĐÍCH: Lấy tất cả bookings của user hiện tại
// ENDPOINT: GET /api/my-bookings
// MIDDLEWARE: verifyToken (đã được gọi ở routes)
// ============================================
export const getMyBookings = async (req: Request, res: Response) => {
  try {
    // Bước 1: Lấy tất cả bookings của user
    // req.userId được set bởi middleware verifyToken
    const userBookings = await Booking.find({ userId: req.userId }).sort({
      createdAt: -1, // Sắp xếp theo createdAt giảm dần (mới nhất trước)
    });

    // Bước 2: Lấy thông tin hotel cho mỗi booking
    // Promise.all() = Chạy tất cả queries song song (nhanh hơn)
    const results = await Promise.all(
      userBookings.map(async (booking) => {
        // Tìm hotel theo hotelId trong booking
        const hotel = await Hotel.findById(booking.hotelId);
        
        // Nếu không tìm thấy hotel, trả về null
        if (!hotel) {
          return null;
        }

        // Tạo response object kết hợp hotel và booking data
        // .toObject() = Chuyển Mongoose document thành plain object
        const hotelWithUserBookings = {
          ...hotel.toObject(),           // Thông tin hotel
          bookings: [booking.toObject()], // Thông tin booking
        };

        return hotelWithUserBookings;
      })
    );

    // Bước 3: Lọc bỏ các kết quả null (hotel không tồn tại)
    const validResults = results.filter((result) => result !== null);
    
    // Bước 4: Trả về response
    res.status(200).send(validResults);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to fetch bookings" });
  }
};

