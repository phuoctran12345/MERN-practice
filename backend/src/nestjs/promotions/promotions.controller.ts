import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { PromotionsService } from "./promotions.service";
import { CreatePromotionDto } from "./dto/create-promotion.dto";
import { UpdatePromotionDto } from "./dto/update-promotion.dto";

@Controller("api/v2/promotions")
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  /**
   * POST /api/v2/promotions
   * Tạo khuyến mãi mới
   */
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createPromotionDto: CreatePromotionDto) {
    return this.promotionsService.create(createPromotionDto);
  }

  /**
   * GET /api/v2/promotions
   * Lấy danh sách khuyến mãi với filters
   */
  @Get()
  findAll(
    @Query("hotelId") hotelId?: string,
    @Query("isActive") isActive?: string,
    @Query("currentDate") currentDate?: string
  ) {
    const isActiveBool = isActive === "true" ? true : isActive === "false" ? false : undefined;
    return this.promotionsService.findAll(hotelId, isActiveBool, currentDate);
  }

  /**
   * GET /api/v2/promotions/active
   * Lấy danh sách khuyến mãi đang hoạt động
   */
  @Get("active")
  findActivePromotions(@Query("hotelId") hotelId?: string) {
    return this.promotionsService.findActivePromotions(hotelId);
  }

  /**
   * GET /api/v2/promotions/:id
   * Lấy chi tiết khuyến mãi
   */
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.promotionsService.findOne(id);
  }

  /**
   * PATCH /api/v2/promotions/:id
   * Cập nhật khuyến mãi
   */
  @Patch(":id")
  @UsePipes(new ValidationPipe({ transform: true }))
  update(@Param("id") id: string, @Body() updatePromotionDto: UpdatePromotionDto) {
    return this.promotionsService.update(id, updatePromotionDto);
  }

  /**
   * DELETE /api/v2/promotions/:id
   * Xóa khuyến mãi
   */
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.promotionsService.remove(id);
  }

  /**
   * POST /api/v2/promotions/:id/use
   * Tăng số lần sử dụng khuyến mãi (khi khách hàng áp dụng)
   */
  @Post(":id/use")
  incrementUsage(@Param("id") id: string) {
    return this.promotionsService.incrementUsage(id);
  }
}
