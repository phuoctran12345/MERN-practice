import { Request, Response } from "express";
import Hotel from "../../models/hotel";
import Booking from "../../models/booking";
import User from "../../models/user";


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

        // B2: Kiểm tra quyền hủy booking
        // Lấy thông tin user hiện tại
        const currentUser = await User.findById(req.userId);
        if (!currentUser) {
            return res.status(401).json({ message: "Không tìm thấy thông tin người dùng" });
        }

        // Kiểm tra quyền:
        // 1. Customer: Chỉ có thể hủy booking của chính mình
        // 2. Manager: Có thể hủy MỌI booking (quản lý booking)
        // 3. Receptionist: Có thể hủy MỌI booking (làm việc với khách hàng)
        // 4. Hotel Owner: Có thể hủy booking của khách sạn của mình
        const isCustomer = String(booking.userId) === String(req.userId);
        const isManager = currentUser.role === "manager";
        const isReceptionist = currentUser.role === "receptionist";
        const isHotelOwner = currentUser.role === "hotel_owner";
        
        // Hotel Owner chỉ có thể hủy booking của khách sạn của mình
        let isOwnerOfThisHotel = false;
        if (isHotelOwner) {
            const hotel = await Hotel.findById(booking.hotelId);
            if (hotel && String(hotel.userId) === String(req.userId)) {
                isOwnerOfThisHotel = true;
            }
        }

        // Log để debug
        console.log(`🔍 Kiểm tra quyền hủy booking:`);
        console.log(`  - Booking ID: ${id}`);
        console.log(`  - Booking userId: ${booking.userId}`);
        console.log(`  - Current userId: ${req.userId}`);
        console.log(`  - Current role: ${currentUser.role}`);
        console.log(`  - isCustomer: ${isCustomer}`);
        console.log(`  - isManager: ${isManager}`);
        console.log(`  - isReceptionist: ${isReceptionist}`);
        console.log(`  - isHotelOwner: ${isHotelOwner}`);
        console.log(`  - isOwnerOfThisHotel: ${isOwnerOfThisHotel}`);

        if (!isCustomer && !isManager && !isReceptionist && !isOwnerOfThisHotel) {
            return res.status(403).json({ 
                message: "Bạn không có quyền hủy đơn đặt phòng này",
                reason: "Chỉ có thể hủy booking của chính bạn, booking của khách sạn bạn sở hữu, hoặc bạn phải có role manager/receptionist",
                userRole: currentUser.role,
                bookingUserId: booking.userId,
                currentUserId: req.userId
            });
        }

        // B3: Kiểm tra status (chỉ có thể hủy nếu status = "pending" hoặc "confirmed")
        if (!["pending", "confirmed"].includes(booking.status)) {
            return res.status(400).json({ 
                message: `Không thể hủy đơn đặt phòng ở trạng thái ${booking.status}`,
                currentStatus: booking.status,
                allowedStatuses: ["pending", "confirmed"]
            });
        }

        // B4: Kiểm tra thời gian hủy
        // - Customer: Chỉ có thể hủy trước 24h check-in
        // - Manager/Receptionist: Có thể hủy bất kỳ lúc nào (trước check-in) - quản lý booking
        // - Hotel Owner: Có thể hủy booking của khách sạn mình bất kỳ lúc nào (trước check-in)
        const now = new Date();
        const checkInDate = new Date(booking.checkIn);
        const hoursUntilCheckIn = (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60);

        // Nếu đã qua check-in → không thể hủy
        if (hoursUntilCheckIn < 0) {
            return res.status(400).json({ 
                message: "Không thể hủy đơn đặt phòng sau ngày check-in" 
            });
        }

        // Customer phải hủy trước 24h
        // Manager/Receptionist/Hotel Owner không bị giới hạn thời gian
        if (isCustomer && hoursUntilCheckIn < 24) {
            return res.status(400).json({ 
                message: "Chỉ có thể hủy đơn đặt phòng trước 24 giờ so với ngày check-in",
                hoursUntilCheckIn: Math.round(hoursUntilCheckIn * 10) / 10
            });
        }

        // B5: Update booking status = "cancelled"
        // Xác định lý do hủy dựa trên người hủy
        let cancellationReason = req.body.cancellationReason;
        if (!cancellationReason) {
            if (isCustomer) {
                cancellationReason = "Khách hàng hủy";
            } else if (isHotelOwner) {
                cancellationReason = "Chủ khách sạn hủy";
            } else if (isManager) {
                cancellationReason = `Quản lý ${currentUser.firstName} ${currentUser.lastName} hủy`;
            } else if (isReceptionist) {
                cancellationReason = `Lễ tân ${currentUser.firstName} ${currentUser.lastName} hủy thay mặt khách hàng`;
            } else if (isOwnerOfThisHotel) {
                cancellationReason = `Chủ khách sạn ${currentUser.firstName} ${currentUser.lastName} hủy`;
            } else {
                cancellationReason = "Hủy bởi hệ thống";
            }
        }

        booking.status = "cancelled";
        booking.cancellationReason = cancellationReason;
        await booking.save();

        // B6: Xử lý refund (nếu đã thanh toán)
        if (booking.paymentStatus === "paid") {
            // TODO: Tích hợp với Stripe để refund
            booking.paymentStatus = "refunded";
            booking.refundAmount = booking.totalCost;
            await booking.save();
        }

        // B7: Update analytics cho hotel
        await Hotel.findByIdAndUpdate(booking.hotelId, {
            $inc: {
                totalBookings: -1,
                totalRevenue: -(booking.totalCost || 0),
            },
        });

        // B8: Update analytics cho user
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



