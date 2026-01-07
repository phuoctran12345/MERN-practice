import { Request, Response } from "express";
import Booking from "../../models/booking";
import Room from "../../models/room";
import ServiceRequest from "../../models/service-request";
import { validationResult } from "express-validator";

// ============================================
// POST /api/v2/booking-operations/check-in
// Thực hiện check-in
export const checkIn = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors: errors.array() });
    }

    const { bookingId, roomId } = req.body;

    // B1: Tìm booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: `Booking với ID ${bookingId} không tồn tại` });
    }

    // B2: Kiểm tra paymentStatus (trim để xử lý dữ liệu có dấu phẩy thừa)
    const paymentStatus = String(booking.paymentStatus).trim().replace(/,$/, "");
    if (paymentStatus !== "paid") {
      return res.status(400).json({
        message: `Booking chưa thanh toán. PaymentStatus hiện tại: ${booking.paymentStatus}`,
      });
    }

    // B3: Kiểm tra status (trim để xử lý dữ liệu có dấu phẩy thừa)
    const bookingStatus = String(booking.status).trim().replace(/,$/, "");
    if (bookingStatus !== "confirmed") {
      return res.status(400).json({
        message: `Booking phải ở trạng thái "confirmed" để check-in. Status hiện tại: ${booking.status}`,
      });
    }

    // B4: Nếu có roomId, kiểm tra và update room
    if (roomId) {
      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({ message: `Room với ID ${roomId} không tồn tại` });
      }

      // Kiểm tra xem room có đang được sử dụng bởi booking khác không
      // Lưu ý: status có thể có dấu phẩy thừa, nên query tất cả rồi filter
      const allBookingsWithRoom = await Booking.find({
        _id: { $ne: bookingId }, // Không phải booking hiện tại
        roomId: roomId,
      });
      
      // Filter bookings có status active (xử lý dấu phẩy thừa)
      const otherBookingUsingRoom = allBookingsWithRoom.find((b) => {
        const status = String(b.status).trim().replace(/,$/, "");
        return status === "confirmed" || status === "checked_in";
      });

      // Nếu booking đã có roomId và trùng với roomId trong request → cho phép check-in
      // So sánh dạng string để tránh lỗi ObjectId vs String
      const bookingRoomIdStr = booking.roomId ? String(booking.roomId) : null;
      const requestedRoomIdStr = String(roomId);
      const isSameRoom = bookingRoomIdStr === requestedRoomIdStr;
      
      // Nếu room đang OCCUPIED và không phải bởi booking này → từ chối
      if (room.status === "OCCUPIED" && !isSameRoom && otherBookingUsingRoom) {
        return res.status(400).json({
          message: `Phòng đang được sử dụng bởi booking khác`,
          currentRoomStatus: room.status,
          bookingRoomId: booking.roomId,
          requestedRoomId: roomId,
          occupiedByBooking: otherBookingUsingRoom._id,
        });
      }

      // Nếu room ở trạng thái MAINTENANCE hoặc RESERVED → từ chối
      if (room.status === "MAINTENANCE" || room.status === "RESERVED") {
        return res.status(400).json({
          message: `Phòng đang ở trạng thái ${room.status}, không thể check-in`,
          currentRoomStatus: room.status,
        });
      }

      // Chỉ update room status nếu chưa OCCUPIED hoặc đang được sử dụng bởi booking này
      if (room.status !== "OCCUPIED" || isSameRoom) {
        await Room.findByIdAndUpdate(roomId, { status: "OCCUPIED" });
      }
    }

    // B5: Update booking (dùng findByIdAndUpdate để tránh mất field)
    const updateData: any = {
      status: "checked_in",
      checkedInAt: new Date(),
    };

    // Chỉ update roomId nếu có
    if (roomId) {
      updateData.roomId = roomId;
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      updateData,
      { new: true } // Trả về document mới sau khi update
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Không tìm thấy booking sau khi update" });
    }

    res.status(200).json({ message: "Check-in thành công", booking: updatedBooking });
  } catch (error) {
    console.error("❌ Lỗi checkIn:");
    console.error("Error details:", error);
    console.error("Error message:", error instanceof Error ? error.message : String(error));
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
    res.status(500).json({ 
      message: "Lỗi khi check-in",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// ============================================
// POST /api/v2/booking-operations/check-out
// Thực hiện check-out
// 
// LOGIC XỬ LÝ PAYMENT:
// 1. Booking đã thanh toán online (paymentStatus = "paid", paymentMethod = "online"):
//    - Nếu có thêm chi phí (service requests + extra charges) → cần thanh toán thêm tại quầy
//    - paymentMethod sẽ là "online, cash" hoặc "online, card" (kết hợp)
//    - paymentStatus vẫn là "paid" (đã thanh toán đủ)
// 
// 2. Booking chưa thanh toán (paymentStatus = "pending"):
//    - Thanh toán toàn bộ tại quầy
//    - paymentMethod = "cash" hoặc "card"
//    - paymentStatus = "paid"
//
// 3. Booking đã thanh toán một phần (paymentStatus = "partial" - nếu có):
//    - Thanh toán phần còn lại tại quầy
//    - paymentMethod kết hợp
//    - paymentStatus = "paid"
export const checkOut = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors: errors.array() });
    }

    const { bookingId, extraCharges, notes, paymentMethod } = req.body;

    // B1: Tìm booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: `Booking với ID ${bookingId} không tồn tại` });
    }

    // B2: Kiểm tra status
    const bookingStatus = String(booking.status).trim().replace(/,$/, "");
    if (bookingStatus !== "checked_in") {
      return res.status(400).json({
        message: `Booking phải ở trạng thái "checked_in" để check-out. Status hiện tại: ${booking.status}`,
      });
    }

    // B3: Tính tổng chi phí dịch vụ
    const serviceRequests = await ServiceRequest.find({
      bookingId,
      status: "completed",
    });
    const serviceRequestsTotal = serviceRequests.reduce((sum, request) => sum + (request.price || 0), 0);

    // B4: Tính finalTotalCost
    // Lưu ý: Booking có thể có totalCost hoặc totalPrice (do dữ liệu cũ)
    const baseCost = (booking as any).totalCost || (booking as any).totalPrice || 0;
    const additionalCharges = extraCharges ? parseFloat(extraCharges) : 0;
    if (additionalCharges < 0) {
      return res.status(400).json({ message: "Extra charges phải >= 0" });
    }
    const finalTotalCost = baseCost + serviceRequestsTotal + additionalCharges;

    // B5: Tính số tiền đã thanh toán và số tiền cần thanh toán thêm
    const currentPaymentStatus = String(booking.paymentStatus || "pending").trim().replace(/,$/, "");
    const alreadyPaid = currentPaymentStatus === "paid" ? baseCost : 0;
    const amountToPay = finalTotalCost - alreadyPaid;

    // B6: Xử lý paymentMethod và paymentStatus
    let finalPaymentMethod = booking.paymentMethod || "";
    let finalPaymentStatus = currentPaymentStatus;

    if (amountToPay > 0) {
      // Có số tiền cần thanh toán thêm
      if (!paymentMethod || (paymentMethod !== "cash" && paymentMethod !== "card")) {
        return res.status(400).json({
          message: "Cần chọn phương thức thanh toán (cash hoặc card) cho phần chi phí bổ sung",
          amountToPay,
        });
      }

      // Cập nhật paymentMethod
      if (currentPaymentStatus === "paid" && booking.paymentMethod === "online") {
        // Đã thanh toán online → thêm phương thức thanh toán tại quầy
        finalPaymentMethod = `online, ${paymentMethod}`;
      } else {
        // Chưa thanh toán hoặc thanh toán một phần → dùng phương thức thanh toán tại quầy
        finalPaymentMethod = paymentMethod;
      }

      // Sau khi thanh toán thêm → paymentStatus = "paid"
      finalPaymentStatus = "paid";
    } else if (amountToPay === 0) {
      // Không có chi phí phát sinh → giữ nguyên payment status
      // Nếu đã thanh toán online → giữ nguyên
      // Nếu chưa thanh toán → có thể đã thanh toán đủ từ trước (edge case)
      if (currentPaymentStatus === "paid") {
        finalPaymentMethod = booking.paymentMethod || "online";
        finalPaymentStatus = "paid";
      }
    } else {
      // amountToPay < 0 → Lỗi logic (không nên xảy ra)
      console.warn(`⚠️ Warning: amountToPay < 0 cho booking ${bookingId}. alreadyPaid=${alreadyPaid}, finalTotalCost=${finalTotalCost}`);
    }

    // B7: Update room status nếu có
    if (booking.roomId) {
      await Room.findByIdAndUpdate(booking.roomId, { status: "AVAILABLE" });
    }

    // B8: Update booking (dùng findByIdAndUpdate để tránh mất field)
    const updateData: any = {
      status: "completed",
      checkedOutAt: new Date(),
      finalTotalCost: finalTotalCost,
      paymentStatus: finalPaymentStatus,
    };

    // Chỉ update paymentMethod nếu có thay đổi
    if (finalPaymentMethod) {
      updateData.paymentMethod = finalPaymentMethod;
    }

    // Lưu notes nếu có
    if (notes && notes.trim()) {
      updateData.notes = notes.trim();
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      updateData,
      { new: true } // Trả về document mới sau khi update
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Không tìm thấy booking sau khi update" });
    }

    res.status(200).json({
      message: "Check-out thành công",
      booking: updatedBooking,
      summary: {
        originalCost: baseCost,
        serviceRequestsTotal,
        additionalCharges,
        finalTotalCost,
        alreadyPaid,
        amountToPay: amountToPay > 0 ? amountToPay : 0,
        paymentMethod: finalPaymentMethod,
        paymentStatus: finalPaymentStatus,
      },
      serviceRequests,
    });
  } catch (error) {
    console.error("❌ Lỗi checkOut:");
    console.error("Error details:", error);
    console.error("Error message:", error instanceof Error ? error.message : String(error));
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
    res.status(500).json({ 
      message: "Lỗi khi check-out",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

