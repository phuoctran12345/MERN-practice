import { PartialType } from "@nestjs/mapped-types";
import { CreateRoomDto } from "./create-room.dto";

/**
 * DTO: UpdateRoomDto
 * MỤC ĐÍCH: Validate dữ liệu khi update Room (tất cả fields optional)
 */
export class UpdateRoomDto extends PartialType(CreateRoomDto) {}

