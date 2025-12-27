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

    // B2: Kiểm tra paymentStatus
    if (booking.paymentStatus !== "paid") {
      return res.status(400).json({
        message: `Booking chưa thanh toán. PaymentStatus hiện tại: ${booking.paymentStatus}`,
      });
    }

    // B3: Kiểm tra status
    if (booking.status !== "confirmed") {
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

      if (room.status !== "AVAILABLE") {
        return res.status(400).json({
          message: `Phòng đang ở trạng thái ${room.status}, không thể check-in`,
        });
      }

      await Room.findByIdAndUpdate(roomId, { status: "OCCUPIED" });
      booking.roomId = roomId;
    }

    // B5: Update booking
    booking.status = "checked_in";
    booking.checkedInAt = new Date();
    await booking.save();

    res.status(200).json({ message: "Check-in thành công", booking });
  } catch (error) {
    console.log("Lỗi checkIn: " + error);
    res.status(500).json({ message: "Lỗi khi check-in" });
  }
};

// ============================================
// POST /api/v2/booking-operations/check-out
// Thực hiện check-out
export const checkOut = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors: errors.array() });
    }

    const { bookingId, extraCharges } = req.body;

    // B1: Tìm booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: `Booking với ID ${bookingId} không tồn tại` });
    }

    // B2: Kiểm tra status
    if (booking.status !== "checked_in") {
      return res.status(400).json({
        message: `Booking phải ở trạng thái "checked_in" để check-out. Status hiện tại: ${booking.status}`,
      });
    }

    // B3: Tính tổng chi phí dịch vụ
    const serviceRequests = await ServiceRequest.find({
      bookingId,
      status: "completed",
    });
    const serviceRequestsTotal = serviceRequests.reduce((sum, request) => sum + request.price, 0);

    // B4: Tính finalTotalCost
    const additionalCharges = extraCharges || 0;
    const finalTotalCost = booking.totalCost + serviceRequestsTotal + additionalCharges;

    // B5: Update room status nếu có
    if (booking.roomId) {
      await Room.findByIdAndUpdate(booking.roomId, { status: "AVAILABLE" });
    }

    // B6: Update booking
    booking.status = "completed";
    booking.checkedOutAt = new Date();
    booking.finalTotalCost = finalTotalCost;
    await booking.save();

    res.status(200).json({
      message: "Check-out thành công",
      booking,
      summary: {
        originalCost: booking.totalCost,
        serviceRequestsTotal,
        additionalCharges,
        finalTotalCost,
      },
      serviceRequests,
    });
  } catch (error) {
    console.log("Lỗi checkOut: " + error);
    res.status(500).json({ message: "Lỗi khi check-out" });
  }
};

