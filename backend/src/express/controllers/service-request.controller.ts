import { Request, Response } from "express";
import ServiceRequest from "../../models/service-request";
import Booking from "../../models/booking";
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

    // B1: Kiểm tra booking có tồn tại không
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: `Booking với ID ${bookingId} không tồn tại` });
    }

    // B2: Kiểm tra booking status
    if (!["confirmed", "checked_in"].includes(booking.status)) {
      return res.status(400).json({
        message: `Booking phải ở trạng thái "confirmed" hoặc "checked_in" để yêu cầu dịch vụ`,
      });
    }

    // B3: Tạo service request
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

    res.status(201).json({ message: "Tạo yêu cầu dịch vụ thành công", serviceRequest });
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

