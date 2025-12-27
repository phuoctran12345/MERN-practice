import { Request, Response } from "express";
import Hotel from "../../models/hotel";
import Booking from "../../models/booking";


// ============================================
// GET /api/my-bookings
// MIDDLEWARE: verifyToken (đã được gọi ở routes)
// Lấy danh sách đơn đặt phòng của người dùng hiện tại
export const getMyBookings = async (req: Request, res: Response) => {
    try {
        // B1: Lấy tất cả bookings của user
        const userBookings = await Booking.find({ userId: req.userId }).sort({
            createdAt: -1, // Sắp xếp  theo createdAt giảm dần (mới n)
        })

        // B2: Lấy thôngt in hotel cho mỗi booking
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
                ...hotel.toObject(),   // thông tin hotel
                bookings: [booking.toObject()], // Lưu booking vào array bookings   
            };

            return hotelWithUserBookings;
        })
    );

    // B3: Lọc bỏ các null (không tìm thấy hotel)
    const validResults = results.filter((result) => result !== null);

    // B4: Trả về kết quả
    res.status(200).json(validResults);
    } catch (error) {
        console.log("Lỗi getMyBookings: " + error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách đơn đặt phòng" });
    }
}

// ============================================
// DELETE /api/my-bookings/:id
// MIDDLEWARE: verifyToken (đã được gọi ở routes)
// Hủy đơn đặt phòng của người dùng hiện tại
// ============================================
export const cancelMyBooking = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // B1: Tìm booking
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: "Không tìm thấy đơn đặt phòng" });
        }

        // B2: Kiểm tra booking có thuộc user không
        if (booking.userId !== req.userId) {
            return res.status(403).json({ message: "Bạn không có quyền hủy đơn đặt phòng này" });
        }

        // B3: Kiểm tra status (chỉ có thể hủy nếu status = "pending" hoặc "confirmed")
        if (!["pending", "confirmed"].includes(booking.status)) {
            return res.status(400).json({ 
                message: `Không thể hủy đơn đặt phòng ở trạng thái ${booking.status}` 
            });
        }

        // B4: Kiểm tra thời gian hủy (có thể hủy trong 24h trước check-in)
        const now = new Date();
        const checkInDate = new Date(booking.checkIn);
        const hoursUntilCheckIn = (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60);

        if (hoursUntilCheckIn < 24) {
            return res.status(400).json({ 
                message: "Chỉ có thể hủy đơn đặt phòng trước 24 giờ so với ngày check-in" 
            });
        }

        // B5: Update booking status = "cancelled"
        booking.status = "cancelled";
        booking.cancellationReason = req.body.cancellationReason || "Khách hàng hủy";
        await booking.save();

        // B6: Xử lý refund (nếu đã thanh toán)
        if (booking.paymentStatus === "paid") {
            // TODO: Tích hợp với Stripe để refund
            booking.paymentStatus = "refunded";
            booking.refundAmount = booking.totalCost;
            await booking.save();
        }

        // B7: Update analytics cho hotel
        const Hotel = (await import("../models/hotel")).default;
        await Hotel.findByIdAndUpdate(booking.hotelId, {
            $inc: {
                totalBookings: -1,
                totalRevenue: -(booking.totalCost || 0),
            },
        });

        // B8: Update analytics cho user
        const User = (await import("../models/user")).default;
        await User.findByIdAndUpdate(booking.userId, {
            $inc: {
                totalBookings: -1,
                totalSpent: -(booking.totalCost || 0),
            },
        });

        res.status(200).json({ 
            message: "Hủy đơn đặt phòng thành công",
            booking: booking.toObject()
        });
    } catch (error) {
        console.log("Lỗi cancelMyBooking: " + error);
        res.status(500).json({ message: "Lỗi khi hủy đơn đặt phòng" });
    }
}



