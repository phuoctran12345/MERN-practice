import { Request, Response } from "express";
import Booking from "../../models/booking";
import Hotel from "../../models/hotel";
import User from "../../models/user";
import AuditLog from "../../models/audit-log";
import { validationResult } from "express-validator";

// ============================================
// GET /api/bookings
// MIDDLEWARE: verifyToken, roleCheck(['receptionist', 'manager', 'hotel_owner'])
// Xem tất cả bookings (Receptionist, Manager và Hotel Owner)
export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userRole = user?.role;
    
    let bookings;
    
    // Nếu là hotel_owner, chỉ xem bookings của khách sạn mình sở hữu
    if (userRole === "hotel_owner") {
      // Lấy danh sách hotel IDs mà user này sở hữu
      const hotels = await Hotel.find({ userId: req.userId }).select("_id");
      const hotelIds = hotels.map(hotel => hotel._id);
      
      // Lấy bookings của các hotel này
      bookings = await Booking.find({ hotelId: { $in: hotelIds } })
        .populate("userId", "firstName lastName email phone")
        .populate("hotelId", "name city country")
        .sort({ createdAt: -1 });
    } else {
      // Receptionist và Manager xem tất cả bookings
      bookings = await Booking.find({})
        .populate("userId", "firstName lastName email phone")
        .populate("hotelId", "name city country")
        .sort({ createdAt: -1 });
    }
    
    res.status(200).json({
      message: "Lấy danh sách bookings thành công",
      count: bookings.length,
      bookings: bookings
    });
  } catch (error) {
    console.error("❌ Lỗi getAllBookings:");
    console.error("Error details:", error);
    console.error("Error message:", error instanceof Error ? error.message : String(error));
    res.status(500).json({ 
      message: "Lỗi khi lấy danh sách bookings",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// ============================================
// PUT /api/bookings/:id
// MIDDLEWARE: verifyToken, roleCheck(['receptionist'])
// Sửa đổi thông tin đặt phòng (Receptionist quản lý)
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
    // Receptionist có thể update booking đã completed (nếu cần)
    const user = (req as any).user;
    const isReceptionist = user && user.role === "receptionist";
    const isCompletedBooking = booking.status === "completed";
    
    // Nếu không phải receptionist và booking đã completed/cancelled → từ chối
    if (!isReceptionist && (isCompletedBooking || booking.status === "cancelled")) {
      return res.status(400).json({ 
        message: `Không thể sửa đơn đặt phòng ở trạng thái ${booking.status}`,
        suggestion: "Vui lòng cập nhật status trước khi sửa thông tin booking"
      });
    }
    
    // Nếu là receptionist nhưng booking đã cancelled → vẫn từ chối (cancelled là final state)
    if (booking.status === "cancelled") {
      return res.status(400).json({ 
        message: `Không thể sửa đơn đặt phòng đã bị hủy (status: cancelled)`,
        suggestion: "Booking đã bị hủy không thể sửa đổi"
      });
    }

    // B3.1: Nếu update booking đã completed → yêu cầu lý do và ghi audit log
    if (isCompletedBooking && isReceptionist) {
      const { adjustmentReason } = updateData;
      
      if (!adjustmentReason || adjustmentReason.trim() === "") {
        return res.status(400).json({
          message: "Vui lòng cung cấp lý do điều chỉnh khi sửa booking đã hoàn thành",
          requiredField: "adjustmentReason"
        });
      }

      // Lưu thông tin cũ để ghi audit log
      const oldData = {
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        adultCount: booking.adultCount,
        childCount: booking.childCount,
        totalCost: booking.totalCost,
      };
      
      // Ghi audit log trước khi update
      try {
        await AuditLog.create({
          userId: user._id.toString(),
          action: "UPDATE_COMPLETED_BOOKING",
          targetType: "BOOKING",
          targetId: id,
          details: {
            oldData,
            newData: updateData,
            adjustmentReason: adjustmentReason,
            updatedBy: user.email,
            updatedByRole: user.role,
          },
          ipAddress: req.ip,
          userAgent: req.get("user-agent"),
        });
      } catch (auditError) {
        console.error("Lỗi ghi audit log:", auditError);
        // Không block update nếu audit log fail, nhưng log lỗi
      }
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
    // Loại bỏ adjustmentReason khỏi updateData (chỉ dùng cho audit log)
    const { adjustmentReason, ...bookingUpdateData } = updateData;
    
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      {
        ...bookingUpdateData,
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
// MIDDLEWARE: verifyToken, roleCheck(['receptionist'])
// Cập nhật trạng thái đặt phòng (Receptionist quản lý)
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