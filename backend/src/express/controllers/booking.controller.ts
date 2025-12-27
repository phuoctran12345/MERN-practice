import { Request, Response } from "express";
import Booking from "../../models/booking";
import Hotel from "../../models/hotel";
import User from "../../models/user";
import { validationResult } from "express-validator";

// ============================================
// PUT /api/bookings/:id
// MIDDLEWARE: verifyToken, roleCheck(['receptionist', 'admin', 'manager'])
// Sửa đổi thông tin đặt phòng (Lễ tân)
export const updateBooking = async (req: Request, res: Response) => {
  try {
    // B1: Validate request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: "Dữ liệu không hợp lệ", 
        errors: errors.array() 
      });
    }

    const { id } = req.params;
    const updateData = req.body;

    // B2: Tìm booking
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Không tìm thấy đơn đặt phòng" });
    }

    // B3: Kiểm tra trạng thái booking có thể sửa
    if (booking.status === "completed" || booking.status === "cancelled") {
      return res.status(400).json({ 
        message: `Không thể sửa đơn đặt phòng ở trạng thái ${booking.status}` 
      });
    }

    // B4: Validate dữ liệu cập nhật
    if (updateData.checkIn && updateData.checkOut) {
      const checkInDate = new Date(updateData.checkIn);
      const checkOutDate = new Date(updateData.checkOut);
      
      if (checkInDate >= checkOutDate) {
        return res.status(400).json({ 
          message: "Ngày check-in phải trước ngày check-out" 
        });
      }
    }

    // B5: Validate hotelId nếu có thay đổi
    if (updateData.hotelId && updateData.hotelId !== booking.hotelId) {
      const hotel = await Hotel.findById(updateData.hotelId);
      if (!hotel) {
        return res.status(404).json({ message: "Không tìm thấy khách sạn" });
      }
    }

    // B6: Validate userId nếu có thay đổi
    if (updateData.userId && updateData.userId !== booking.userId) {
      const user = await User.findById(updateData.userId);
      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }
    }

    // B7: Cập nhật booking
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      {
        ...updateData,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Không tìm thấy đơn đặt phòng" });
    }

    res.status(200).json({ 
      message: "Cập nhật đơn đặt phòng thành công", 
      booking: updatedBooking 
    });

  } catch (error) {
    console.log("Lỗi updateBooking: " + error);
    res.status(500).json({ message: "Lỗi khi cập nhật đơn đặt phòng" });
  }
};

// ============================================
// PATCH /api/bookings/:id/status
// MIDDLEWARE: verifyToken, roleCheck(['receptionist', 'admin', 'manager'])
// Cập nhật trạng thái đặt phòng
export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, cancellationReason } = req.body;

    // B1: Validate status
    const validStatuses = ["pending", "confirmed", "checked_in", "completed", "cancelled", "refunded"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: "Trạng thái không hợp lệ",
        validStatuses 
      });
    }

    // B2: Tìm booking
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Không tìm thấy đơn đặt phòng" });
    }

    // B3: Validate state transitions
    const currentStatus = booking.status;
    const invalidTransitions = [
      { from: "completed", to: ["pending", "confirmed", "checked_in"] },
      { from: "cancelled", to: ["pending", "confirmed", "checked_in", "completed"] },
      { from: "refunded", to: ["pending", "confirmed", "checked_in", "completed"] },
    ];

    const invalidTransition = invalidTransitions.find(
      (transition) => transition.from === currentStatus && transition.to.includes(status)
    );

    if (invalidTransition) {
      return res.status(400).json({ 
        message: `Không thể chuyển từ trạng thái ${currentStatus} sang ${status}` 
      });
    }

    // B4: Cập nhật booking
    const updateData: any = { 
      status,
      updatedAt: new Date(),
    };

    if (status === "cancelled" && cancellationReason) {
      updateData.cancellationReason = cancellationReason;
    }

    const updatedBooking = await Booking.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({ 
      message: "Cập nhật trạng thái đặt phòng thành công", 
      booking: updatedBooking 
    });

  } catch (error) {
    console.log("Lỗi updateBookingStatus: " + error);
    res.status(500).json({ message: "Lỗi khi cập nhật trạng thái đặt phòng" });
  }
};