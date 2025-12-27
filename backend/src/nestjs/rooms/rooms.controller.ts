import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { RoomsService } from "./rooms.service";
import { CreateRoomDto } from "./dto/create-room.dto";
import { UpdateRoomDto } from "./dto/update-room.dto";

/**
 * CONTROLLER: RoomsController
 * MỤC ĐÍCH: Xử lý HTTP requests cho Room operations
 * ROUTE: /api/v2/rooms
 */
@Controller("rooms")
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  /**
   * POST /api/v2/rooms
   * Tạo room mới
   */
  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  /**
   * GET /api/v2/rooms?hotelId=xxx&status=AVAILABLE
   * Lấy danh sách rooms (có thể filter theo hotelId và status)
   */
  @Get()
  findAll(@Query("hotelId") hotelId: string, @Query("status") status?: string) {
    if (!hotelId) {
      return { message: "hotelId is required" };
    }
    return this.roomsService.findAll(hotelId, status);
  }

  /**
   * GET /api/v2/rooms/available
   * Tìm phòng trống trong khoảng thời gian
   */
  @Get("available")
  findAvailableRooms(
    @Query("hotelId") hotelId: string,
    @Query("checkIn") checkIn: string,
    @Query("checkOut") checkOut: string
  ) {
    if (!hotelId || !checkIn || !checkOut) {
      return { message: "hotelId, checkIn, checkOut are required" };
    }
    return this.roomsService.findAvailableRooms(
      hotelId,
      new Date(checkIn),
      new Date(checkOut)
    );
  }

  /**
   * GET /api/v2/rooms/:id
   * Lấy thông tin một room cụ thể
   */
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.roomsService.findOne(id);
  }

  /**
   * PATCH /api/v2/rooms/:id
   * Cập nhật thông tin room
   */
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(id, updateRoomDto);
  }

  /**
   * PATCH /api/v2/rooms/:id/status
   * Cập nhật status của room
   */
  @Patch(":id/status")
  updateStatus(@Param("id") id: string, @Body("status") status: string) {
    return this.roomsService.updateStatus(id, status);
  }

  /**
   * DELETE /api/v2/rooms/:id
   * Xóa room
   */
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.roomsService.remove(id);
  }
}

