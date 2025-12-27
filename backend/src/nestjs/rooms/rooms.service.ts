import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Room, RoomDocument } from "./schemas/room.schema";
import { CreateRoomDto } from "./dto/create-room.dto";
import { UpdateRoomDto } from "./dto/update-room.dto";
import Hotel from "../../models/hotel";

/**
 * SERVICE: RoomsService
 * MỤC ĐÍCH: Xử lý business logic cho Room operations
 */
@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>
  ) {}

  /**
   * FUNCTION: create
   * MỤC ĐÍCH: Tạo Room mới
   * VALIDATION: Kiểm tra hotel tồn tại, roomNumber unique trong hotel
   */
  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    // B1: Kiểm tra hotel có tồn tại không
    const hotel = await Hotel.findById(createRoomDto.hotelId);
    if (!hotel) {
      throw new NotFoundException(`Hotel với ID ${createRoomDto.hotelId} không tồn tại`);
    }

    // B2: Kiểm tra roomNumber đã tồn tại trong hotel chưa
    const existingRoom = await this.roomModel.findOne({
      hotelId: createRoomDto.hotelId,
      roomNumber: createRoomDto.roomNumber,
    });

    if (existingRoom) {
      throw new BadRequestException(
        `Phòng số ${createRoomDto.roomNumber} đã tồn tại trong khách sạn này`
      );
    }

    // B3: Tạo room mới
    const room = new this.roomModel(createRoomDto);
    return room.save();
  }

  /**
   * FUNCTION: findAll
   * MỤC ĐÍCH: Lấy tất cả rooms của một hotel
   */
  async findAll(hotelId: string, status?: string): Promise<Room[]> {
    const query: any = { hotelId };

    if (status) {
      query.status = status;
    }

    return this.roomModel.find(query).sort({ roomNumber: 1 }).exec();
  }

  /**
   * FUNCTION: findOne
   * MỤC ĐÍCH: Lấy thông tin một room cụ thể
   */
  async findOne(id: string): Promise<Room> {
    const room = await this.roomModel.findById(id).exec();

    if (!room) {
      throw new NotFoundException(`Room với ID ${id} không tồn tại`);
    }

    return room;
  }

  /**
   * FUNCTION: update
   * MỤC ĐÍCH: Cập nhật thông tin room
   */
  async update(id: string, updateRoomDto: UpdateRoomDto): Promise<Room> {
    // Nếu update roomNumber, kiểm tra unique
    if (updateRoomDto.roomNumber) {
      const room = await this.roomModel.findById(id).exec();
      if (!room) {
        throw new NotFoundException(`Room với ID ${id} không tồn tại`);
      }

      const existingRoom = await this.roomModel.findOne({
        hotelId: room.hotelId,
        roomNumber: updateRoomDto.roomNumber,
        _id: { $ne: id }, // Loại trừ room hiện tại
      });

      if (existingRoom) {
        throw new BadRequestException(
          `Phòng số ${updateRoomDto.roomNumber} đã tồn tại trong khách sạn này`
        );
      }
    }

    const updatedRoom = await this.roomModel
      .findByIdAndUpdate(id, updateRoomDto, { new: true })
      .exec();

    if (!updatedRoom) {
      throw new NotFoundException(`Room với ID ${id} không tồn tại`);
    }

    return updatedRoom;
  }

  /**
   * FUNCTION: remove
   * MỤC ĐÍCH: Xóa room
   */
  async remove(id: string): Promise<void> {
    const result = await this.roomModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Room với ID ${id} không tồn tại`);
    }
  }

  /**
   * FUNCTION: updateStatus
   * MỤC ĐÍCH: Cập nhật status của room (dùng cho check-in/check-out)
   */
  async updateStatus(id: string, status: string): Promise<Room> {
    const room = await this.roomModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();

    if (!room) {
      throw new NotFoundException(`Room với ID ${id} không tồn tại`);
    }

    return room;
  }

  /**
   * FUNCTION: findAvailableRooms
   * MỤC ĐÍCH: Tìm các phòng trống trong khoảng thời gian
   */
  async findAvailableRooms(
    hotelId: string,
    checkIn: Date,
    checkOut: Date
  ): Promise<Room[]> {
    // TODO: Logic phức tạp hơn - kiểm tra bookings trong khoảng thời gian
    // Hiện tại chỉ trả về rooms có status = AVAILABLE
    return this.roomModel
      .find({
        hotelId,
        status: "AVAILABLE",
      })
      .exec();
  }
}

