import { Request, Response } from "express";
import Room from "../../models/room";
import Hotel from "../../models/hotel";
import Booking from "../../models/booking";
import { validationResult } from "express-validator";

// ============================================
// POST /api/v2/rooms
// MIDDLEWARE: verifyToken (nếu cần)
// Tạo room mới
export const createRoom = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors: errors.array() });
    }

    const { hotelId, roomNumber, roomType, basePrice, maxOccupancy, bedType, amenities, floor, status } = req.body;

    // B1: Kiểm tra hotel có tồn tại không
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: `Hotel với ID ${hotelId} không tồn tại` });
    }

    // B2: Kiểm tra roomNumber đã tồn tại trong hotel chưa
    const existingRoom = await Room.findOne({
      hotelId: hotelId,
      roomNumber: roomNumber,
    });

    if (existingRoom) {
      return res.status(400).json({
        message: `Phòng số ${roomNumber} đã tồn tại trong khách sạn này`,
      });
    }

    // B3: Tạo room mới
    const room = new Room({
      hotelId,
      roomNumber,
      roomType,
      basePrice,
      maxOccupancy,
      bedType,
      amenities: amenities || [],
      floor,
      status: status || "AVAILABLE",
    });

    await room.save();

    res.status(201).json({ message: "Tạo phòng thành công", room });
  } catch (error) {
    console.log("Lỗi createRoom: " + error);
    res.status(500).json({ message: "Lỗi khi tạo phòng" });
  }
};

// ============================================
// GET /api/v2/rooms?hotelId=xxx&status=AVAILABLE
// Lấy danh sách rooms (có thể filter theo hotelId và status)
export const getAllRooms = async (req: Request, res: Response) => {
  try {
    const { hotelId, status } = req.query;

    if (!hotelId) {
      return res.status(400).json({ message: "hotelId là bắt buộc" });
    }

    const query: any = { hotelId: hotelId as string };

    if (status) {
      query.status = status;
    }

    const rooms = await Room.find(query).sort({ roomNumber: 1 });

    res.status(200).json({ rooms });
  } catch (error) {
    console.log("Lỗi getAllRooms: " + error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách phòng" });
  }
};

// ============================================
// GET /api/v2/rooms/:id
// Lấy thông tin một room cụ thể
export const getRoomById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const room = await Room.findById(id);

    if (!room) {
      return res.status(404).json({ message: `Room với ID ${id} không tồn tại` });
    }

    res.status(200).json({ room });
  } catch (error) {
    console.log("Lỗi getRoomById: " + error);
    res.status(500).json({ message: "Lỗi khi lấy thông tin phòng" });
  }
};

// ============================================
// PATCH /api/v2/rooms/:id
// Cập nhật thông tin room
export const updateRoom = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Nếu update roomNumber, kiểm tra unique
    if (updateData.roomNumber) {
      const room = await Room.findById(id);
      if (!room) {
        return res.status(404).json({ message: `Room với ID ${id} không tồn tại` });
      }

      const existingRoom = await Room.findOne({
        hotelId: room.hotelId,
        roomNumber: updateData.roomNumber,
        _id: { $ne: id }, // Loại trừ room hiện tại
      });

      if (existingRoom) {
        return res.status(400).json({
          message: `Phòng số ${updateData.roomNumber} đã tồn tại trong khách sạn này`,
        });
      }
    }

    const updatedRoom = await Room.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedRoom) {
      return res.status(404).json({ message: `Room với ID ${id} không tồn tại` });
    }

    res.status(200).json({ message: "Cập nhật phòng thành công", room: updatedRoom });
  } catch (error) {
    console.log("Lỗi updateRoom: " + error);
    res.status(500).json({ message: "Lỗi khi cập nhật phòng" });
  }
};

// ============================================
// PATCH /api/v2/rooms/:id/status
// Cập nhật status của room
export const updateRoomStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["AVAILABLE", "OCCUPIED", "MAINTENANCE", "RESERVED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Status không hợp lệ", validStatuses });
    }

    const room = await Room.findByIdAndUpdate(id, { status }, { new: true });

    if (!room) {
      return res.status(404).json({ message: `Room với ID ${id} không tồn tại` });
    }

    res.status(200).json({ message: "Cập nhật status thành công", room });
  } catch (error) {
    console.log("Lỗi updateRoomStatus: " + error);
    res.status(500).json({ message: "Lỗi khi cập nhật status" });
  }
};

// ============================================
// DELETE /api/v2/rooms/:id
// Xóa room
export const deleteRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const room = await Room.findByIdAndDelete(id);

    if (!room) {
      return res.status(404).json({ message: `Room với ID ${id} không tồn tại` });
    }

    res.status(200).json({ message: "Xóa phòng thành công" });
  } catch (error) {
    console.log("Lỗi deleteRoom: " + error);
    res.status(500).json({ message: "Lỗi khi xóa phòng" });
  }
};

// ============================================
// GET /api/v2/rooms/available?hotelId=xxx&checkIn=xxx&checkOut=xxx
// Tìm phòng trống trong khoảng thời gian
export const findAvailableRooms = async (req: Request, res: Response) => {
  try {
    const { hotelId, checkIn, checkOut } = req.query;

    if (!hotelId || !checkIn || !checkOut) {
      return res.status(400).json({
        message: "hotelId, checkIn, checkOut là bắt buộc",
      });
    }

    const checkInDate = new Date(checkIn as string);
    const checkOutDate = new Date(checkOut as string);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({ message: "Định dạng ngày không hợp lệ" });
    }

    // Tìm các bookings đang chiếm phòng trong khoảng thời gian
    const overlappingBookings = await Booking.find({
      hotelId: hotelId as string,
      status: { $in: ["confirmed", "checked_in"] },
      $or: [
        { checkIn: { $lt: checkOutDate, $gte: checkInDate } },
        { checkOut: { $gt: checkInDate, $lte: checkOutDate } },
        { checkIn: { $lte: checkInDate }, checkOut: { $gte: checkOutDate } },
      ],
    }).select("roomId");

    const bookedRoomIds = overlappingBookings
      .map((booking) => booking.roomId)
      .filter((id) => id != null);

    // Tìm các phòng available và không bị booking
    const availableRooms = await Room.find({
      hotelId: hotelId as string,
      status: "AVAILABLE",
      _id: { $nin: bookedRoomIds },
    });

    res.status(200).json({ rooms: availableRooms });
  } catch (error) {
    console.log("Lỗi findAvailableRooms: " + error);
    res.status(500).json({ message: "Lỗi khi tìm phòng trống" });
  }
};

