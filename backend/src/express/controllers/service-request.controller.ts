import { Request, Response } from "express";
import ServiceRequest from "../../models/service-request";
import Booking from "../../models/booking";
import User from "../../models/user";
import { validationResult } from "express-validator";

// ============================================
// POST /api/v2/service-requests
// Tạo service request mới
export const createServiceRequest = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors: errors.array() });
    }

    const { bookingId, userId, hotelId, serviceType, description, price } = req.body;

    // B1: Lấy thông tin user hiện tại để kiểm tra role
    const currentUser = await User.findById(req.userId);
    if (!currentUser) {
      return res.status(404).json({ message: "Không tìm thấy thông tin người dùng" });
    }

    // B2: Kiểm tra booking có tồn tại không
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: `Booking với ID ${bookingId} không tồn tại` });
    }

    // B3: Tự động cập nhật booking status nếu đã thanh toán nhưng vẫn pending
    if (booking.status === "pending" && booking.paymentStatus === "paid") {
      console.log(`🔄 Tự động cập nhật booking ${bookingId} từ "pending" → "confirmed"`);
      booking.status = "confirmed";
      await booking.save();
    }

    // B4: Kiểm tra quyền và booking status
    const userRole = currentUser.role;
    const isStaff = ["hotel_owner", "receptionist", "manager"].includes(userRole);
    
    console.log(`📋 Booking ID: ${bookingId}, Status: "${booking.status}", User Role: "${userRole}"`);
    
    // Nếu là staff (hotel_owner/receptionist/manager) → cho phép tạo service request bất kể status
    if (isStaff) {
      console.log(`✅ User có role "${userRole}" - Cho phép tạo service request bất kể booking status`);
    } else {
      // Nếu là customer → kiểm tra booking status
      if (booking.status === "pending" && booking.paymentStatus === "pending") {
        // Kiểm tra xem booking có đủ thông tin để confirm không
        const hasRequiredInfo = booking.firstName && booking.lastName && 
                                booking.email && booking.checkIn && booking.checkOut;
        
        if (hasRequiredInfo) {
          console.log(`⚠️ Booking ${bookingId} đang pending nhưng có đủ thông tin. Cho phép tạo service request với cảnh báo.`);
          // Cho phép tạo service request nhưng cảnh báo
        } else {
          return res.status(400).json({
            message: `Booking phải ở trạng thái "confirmed" hoặc "checked_in" để yêu cầu dịch vụ`,
            currentStatus: booking.status,
            paymentStatus: booking.paymentStatus,
            bookingId: bookingId,
            allowedStatuses: ["confirmed", "checked_in"],
            suggestion: "Vui lòng cập nhật booking status thành 'confirmed' trước khi tạo service request",
          });
        }
      } else if (!["confirmed", "checked_in"].includes(booking.status)) {
        return res.status(400).json({
          message: `Booking phải ở trạng thái "confirmed" hoặc "checked_in" để yêu cầu dịch vụ`,
          currentStatus: booking.status,
          paymentStatus: booking.paymentStatus,
          bookingId: bookingId,
          allowedStatuses: ["confirmed", "checked_in"],
        });
      }
    }

    // B5: Tạo service request
    const serviceRequest = new ServiceRequest({
      bookingId,
      userId,
      hotelId,
      serviceType,
      description,
      price: price || 0,
      status: "pending",
    });

    await serviceRequest.save();

    // B6: Trả về response với cảnh báo nếu booking đang pending
    const response: any = { 
      message: "Tạo yêu cầu dịch vụ thành công", 
      serviceRequest 
    };

    if (booking.status === "pending") {
      response.warning = "Booking đang ở trạng thái 'pending'. Vui lòng cập nhật booking status thành 'confirmed' hoặc 'checked_in' để đảm bảo dịch vụ được xử lý đúng.";
    }

    res.status(201).json(response);
  } catch (error) {
    console.log("Lỗi createServiceRequest: " + error);
    res.status(500).json({ message: "Lỗi khi tạo yêu cầu dịch vụ" });
  }
};

// ============================================
// GET /api/v2/service-requests?bookingId=xxx&userId=xxx&hotelId=xxx&status=xxx
// Lấy danh sách service requests
export const getAllServiceRequests = async (req: Request, res: Response) => {
  try {
    const { bookingId, userId, hotelId, status } = req.query;

    const query: any = {};
    if (bookingId) query.bookingId = bookingId;
    if (userId) query.userId = userId;
    if (hotelId) query.hotelId = hotelId;
    if (status) query.status = status;

    const serviceRequests = await ServiceRequest.find(query).sort({ requestedAt: -1 });

    res.status(200).json({ serviceRequests });
  } catch (error) {
    console.log("Lỗi getAllServiceRequests: " + error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách yêu cầu dịch vụ" });
  }
};

// ============================================
// GET /api/v2/service-requests/:id
// Lấy thông tin một service request
export const getServiceRequestById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const serviceRequest = await ServiceRequest.findById(id);

    if (!serviceRequest) {
      return res.status(404).json({ message: `Service Request với ID ${id} không tồn tại` });
    }

    res.status(200).json({ serviceRequest });
  } catch (error) {
    console.log("Lỗi getServiceRequestById: " + error);
    res.status(500).json({ message: "Lỗi khi lấy thông tin yêu cầu dịch vụ" });
  }
};

// ============================================
// PATCH /api/v2/service-requests/:id
// Cập nhật service request
export const updateServiceRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedServiceRequest = await ServiceRequest.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedServiceRequest) {
      return res.status(404).json({ message: `Service Request với ID ${id} không tồn tại` });
    }

    // Nếu status = completed, set completedAt
    if (updateData.status === "completed" && !updatedServiceRequest.completedAt) {
      updatedServiceRequest.completedAt = new Date();
      await updatedServiceRequest.save();
    }

    res.status(200).json({ message: "Cập nhật yêu cầu dịch vụ thành công", serviceRequest: updatedServiceRequest });
  } catch (error) {
    console.log("Lỗi updateServiceRequest: " + error);
    res.status(500).json({ message: "Lỗi khi cập nhật yêu cầu dịch vụ" });
  }
};

// ============================================
// DELETE /api/v2/service-requests/:id
// Xóa service request
export const deleteServiceRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const serviceRequest = await ServiceRequest.findByIdAndDelete(id);

    if (!serviceRequest) {
      return res.status(404).json({ message: `Service Request với ID ${id} không tồn tại` });
    }

    res.status(200).json({ message: "Xóa yêu cầu dịch vụ thành công" });
  } catch (error) {
    console.log("Lỗi deleteServiceRequest: " + error);
    res.status(500).json({ message: "Lỗi khi xóa yêu cầu dịch vụ" });
  }
};

// ============================================
// GET /api/v2/service-requests/booking/:bookingId/total
// Tính tổng chi phí dịch vụ của một booking
export const calculateTotalServiceCost = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;

    const serviceRequests = await ServiceRequest.find({
      bookingId,
      status: "completed",
    });

    const totalCost = serviceRequests.reduce((sum, request) => sum + request.price, 0);

    res.status(200).json({ bookingId, totalCost, serviceCount: serviceRequests.length });
  } catch (error) {
    console.log("Lỗi calculateTotalServiceCost: " + error);
    res.status(500).json({ message: "Lỗi khi tính tổng chi phí dịch vụ" });
  }
};

