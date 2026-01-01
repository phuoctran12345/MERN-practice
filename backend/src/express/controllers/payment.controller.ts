import { Request, Response } from "express";
import Booking from "../../models/booking";
import { getPaymentInfo } from "../../services/payos.service";

/**
 * GET /api/payments
 * Lấy danh sách tất cả giao dịch thanh toán (từ bookings có orderCode)
 */
export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const { status, paymentStatus, hotelId, userId, page = 1, limit = 20 } = req.query;

    // Build query
    const query: any = {
      orderCode: { $exists: true, $ne: null }, // Chỉ lấy bookings có orderCode (đã thanh toán qua PayOS)
    };

    if (status) {
      query.status = status;
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    if (hotelId) {
      query.hotelId = hotelId;
    }

    if (userId) {
      query.userId = userId;
    }

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Get bookings (payments)
    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate("userId", "firstName lastName email")
      .populate("hotelId", "name city country")
      .exec();

    // Get total count
    const total = await Booking.countDocuments(query);

    // Format response
    const payments = bookings.map((booking) => ({
      orderCode: booking.orderCode,
      bookingId: booking._id,
      userId: booking.userId,
      hotelId: booking.hotelId,
      hotelName: (booking.hotelId as any)?.name,
      customerName: `${(booking.userId as any)?.firstName || ""} ${(booking.userId as any)?.lastName || ""}`.trim(),
      customerEmail: (booking.userId as any)?.email,
      amount: booking.totalCost || booking.finalTotalCost || 0,
      status: booking.paymentStatus,
      bookingStatus: booking.status,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    }));

    res.status(200).json({
      message: "Lấy danh sách giao dịch thanh toán thành công",
      payments,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("❌ Lỗi getAllPayments:", error);
    res.status(500).json({
      message: "Lỗi khi lấy danh sách giao dịch thanh toán",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * GET /api/payments/:orderCode
 * Lấy chi tiết một giao dịch thanh toán theo orderCode
 */
export const getPaymentByOrderCode = async (req: Request, res: Response) => {
  try {
    const { orderCode } = req.params;

    if (!orderCode) {
      return res.status(400).json({ message: "orderCode là bắt buộc" });
    }

    // Tìm booking theo orderCode
    const booking = await Booking.findOne({ orderCode: parseInt(orderCode) })
      .populate("userId", "firstName lastName email phone")
      .populate("hotelId", "name city country imageUrls")
      .exec();

    if (!booking) {
      return res.status(404).json({
        message: `Không tìm thấy giao dịch với orderCode: ${orderCode}`,
      });
    }

    // Lấy thông tin payment từ PayOS (nếu có)
    let payosPaymentInfo = null;
    try {
      payosPaymentInfo = await getPaymentInfo(parseInt(orderCode));
    } catch (error) {
      console.warn(`⚠️ Không thể lấy thông tin từ PayOS cho orderCode ${orderCode}:`, error);
    }

    // Format response
    const paymentDetail = {
      orderCode: booking.orderCode,
      bookingId: booking._id,
      userId: booking.userId,
      hotelId: booking.hotelId,
      hotelName: (booking.hotelId as any)?.name,
      hotelCity: (booking.hotelId as any)?.city,
      customerName: `${(booking.userId as any)?.firstName || ""} ${(booking.userId as any)?.lastName || ""}`.trim(),
      customerEmail: (booking.userId as any)?.email,
      customerPhone: (booking.userId as any)?.phone,
      amount: booking.totalCost || booking.finalTotalCost || 0,
      finalTotalCost: booking.finalTotalCost,
      status: booking.paymentStatus,
      bookingStatus: booking.status,
      paymentMethod: booking.paymentMethod,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      adultCount: booking.adultCount,
      childCount: booking.childCount,
      specialRequests: booking.specialRequests,
      checkedInAt: booking.checkedInAt,
      checkedOutAt: booking.checkedOutAt,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      payosInfo: payosPaymentInfo, // Thông tin từ PayOS (nếu có)
    };

    res.status(200).json({
      message: "Lấy chi tiết giao dịch thanh toán thành công",
      payment: paymentDetail,
    });
  } catch (error) {
    console.error("❌ Lỗi getPaymentByOrderCode:", error);
    res.status(500).json({
      message: "Lỗi khi lấy chi tiết giao dịch thanh toán",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * GET /api/payments/statistics
 * Lấy thống kê giao dịch thanh toán
 */
export const getPaymentStatistics = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, hotelId } = req.query;

    // Build query
    const query: any = {
      orderCode: { $exists: true, $ne: null },
      paymentStatus: "paid",
    };

    if (hotelId) {
      query.hotelId = hotelId;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate as string);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate as string);
      }
    }

    // Get statistics
    const totalTransactions = await Booking.countDocuments(query);
    
    const totalRevenueResult = await Booking.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: { $ifNull: ["$finalTotalCost", "$totalCost"] },
          },
        },
      },
    ]);

    const totalRevenue = totalRevenueResult[0]?.totalRevenue || 0;

    // Get status breakdown
    const statusBreakdown = await Booking.aggregate([
      { $match: { orderCode: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: "$paymentStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      message: "Lấy thống kê giao dịch thanh toán thành công",
      statistics: {
        totalTransactions,
        totalRevenue,
        statusBreakdown: statusBreakdown.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {} as Record<string, number>),
      },
    });
  } catch (error) {
    console.error("❌ Lỗi getPaymentStatistics:", error);
    res.status(500).json({
      message: "Lỗi khi lấy thống kê giao dịch thanh toán",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

