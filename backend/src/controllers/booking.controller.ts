// ============================================
// FILE: booking.controller.ts
// MỤC ĐÍCH: Controller xử lý business logic cho Booking (Admin/Management)
// TRONG MVC: Đây là Controller layer
// ============================================

import { Request, Response } from "express";
import Booking from "../models/booking";
import Hotel from "../models/hotel";
import User from "../models/user";

// ============================================
// FUNCTION: getAllBookings
// MỤC ĐÍCH: Lấy tất cả bookings (Admin only)
// ENDPOINT: GET /api/bookings
// MIDDLEWARE: verifyToken (đã được gọi ở routes)
// ============================================
export const getAllBookings = async (req: Request, res: Response) => {
  try {
    // Tìm tất cả bookings, sắp xếp theo createdAt giảm dần (mới nhất trước)
    // .populate() = Thay thế hotelId bằng thông tin hotel (name, city, country)
    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .populate("hotelId", "name city country");

    res.status(200).json(bookings);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to fetch bookings" });
  }
};

// ============================================
// FUNCTION: getBookingsByHotel
// MỤC ĐÍCH: Lấy bookings theo hotel ID (cho chủ hotel)
// ENDPOINT: GET /api/bookings/hotel/:hotelId
// MIDDLEWARE: verifyToken (đã được gọi ở routes)
// ============================================
export const getBookingsByHotel = async (req: Request, res: Response) => {
  try {
    const { hotelId } = req.params;

    // Bước 1: Kiểm tra hotel có tồn tại không
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Bước 2: Kiểm tra hotel có thuộc về user hiện tại không
    // Chỉ chủ hotel mới xem được bookings của hotel đó
    if (hotel.userId !== req.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Bước 3: Tìm tất cả bookings của hotel
    // .populate() = Thay thế userId bằng thông tin user (firstName, lastName, email)
    const bookings = await Booking.find({ hotelId })
      .sort({ createdAt: -1 })
      .populate("userId", "firstName lastName email");

    res.status(200).json(bookings);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to fetch hotel bookings" });
  }
};

// ============================================
// FUNCTION: getBookingById
// MỤC ĐÍCH: Lấy một booking cụ thể theo ID
// ENDPOINT: GET /api/bookings/:id
// MIDDLEWARE: verifyToken (đã được gọi ở routes)
// ============================================
export const getBookingById = async (req: Request, res: Response) => {
  try {
    // Tìm booking theo ID
    // .populate() = Thay thế hotelId bằng thông tin hotel (name, city, country, imageUrls)
    const booking = await Booking.findById(req.params.id).populate(
      "hotelId",
      "name city country imageUrls"
    );

    // Nếu không tìm thấy booking
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to fetch booking" });
  }
};

// ============================================
// FUNCTION: updateBookingStatus
// MỤC ĐÍCH: Cập nhật trạng thái booking
// ENDPOINT: PATCH /api/bookings/:id/status
// MIDDLEWARE: verifyToken, validation (đã được gọi ở routes)
// ============================================
export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { status, cancellationReason } = req.body;

    // Chuẩn bị dữ liệu update
    const updateData: any = { status };
    
    // Nếu status là "cancelled" và có cancellationReason
    if (status === "cancelled" && cancellationReason) {
      updateData.cancellationReason = cancellationReason;
    }
    
    // Nếu status là "refunded" và có refundAmount
    if (status === "refunded") {
      updateData.refundAmount = req.body.refundAmount || 0;
    }

    // Cập nhật booking
    // findByIdAndUpdate() = Tìm và cập nhật trong một lần
    // { new: true } = Trả về document sau khi update
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    // Nếu không tìm thấy booking
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to update booking" });
  }
};

// ============================================
// FUNCTION: updatePaymentStatus
// MỤC ĐÍCH: Cập nhật trạng thái thanh toán
// ENDPOINT: PATCH /api/bookings/:id/payment
// MIDDLEWARE: verifyToken, validation (đã được gọi ở routes)
// ============================================
export const updatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const { paymentStatus, paymentMethod } = req.body;

    // Chuẩn bị dữ liệu update
    const updateData: any = { paymentStatus };
    
    // Nếu có paymentMethod, thêm vào updateData
    if (paymentMethod) {
      updateData.paymentMethod = paymentMethod;
    }

    // Cập nhật booking
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    // Nếu không tìm thấy booking
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to update payment status" });
  }
};

// ============================================
// FUNCTION: deleteBooking
// MỤC ĐÍCH: Xóa booking (Admin only)
// ENDPOINT: DELETE /api/bookings/:id
// MIDDLEWARE: verifyToken (đã được gọi ở routes)
// ============================================
export const deleteBooking = async (req: Request, res: Response) => {
  try {
    // Tìm và xóa booking
    const booking = await Booking.findByIdAndDelete(req.params.id);

    // Nếu không tìm thấy booking
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Cập nhật analytics cho hotel
    // $inc = Increment (tăng giá trị)
    // -1 = Giảm đi 1
    // -(booking.totalCost || 0) = Giảm revenue
    await Hotel.findByIdAndUpdate(booking.hotelId, {
      $inc: {
        totalBookings: -1,
        totalRevenue: -(booking.totalCost || 0),
      },
    });

    // Cập nhật analytics cho user
    await User.findByIdAndUpdate(booking.userId, {
      $inc: {
        totalBookings: -1,
        totalSpent: -(booking.totalCost || 0),
      },
    });

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to delete booking" });
  }
};

