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
  BadRequestException,
  UseGuards,
} from "@nestjs/common";
import { EmployeesService } from "./employees.service";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";

// Chỉ admin và manager mới được quản lý nhân viên
@Controller("api/v2/employees")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin", "manager")
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  /**
   * POST /api/v2/employees
   * Tạo nhân viên mới (Admin only)
   */
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  /**
   * GET /api/v2/employees
   * Lấy danh sách nhân viên với pagination và filters
   */
  @Get()
  findAll(
    @Query("companyId") companyId?: string,
    @Query("role") role?: string,
    @Query("isActive") isActive?: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string
  ) {
    const isActiveBool = isActive === "true" ? true : isActive === "false" ? false : undefined;
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    if (pageNum < 1 || limitNum < 1) {
      throw new BadRequestException("Page and limit must be positive numbers");
    }

    return this.employeesService.findAll(companyId, role, isActiveBool, pageNum, limitNum);
  }

  /**
   * GET /api/v2/employees/by-role/:role
   * Lấy danh sách nhân viên theo role
   */
  @Get("by-role/:role")
  getEmployeesByRole(
    @Param("role") role: string,
    @Query("companyId") companyId?: string
  ) {
    return this.employeesService.getEmployeesByRole(role, companyId);
  }

  /**
   * GET /api/v2/employees/:id
   * Lấy chi tiết nhân viên
   */
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.employeesService.findOne(id);
  }

  /**
   * PATCH /api/v2/employees/:id
   * Cập nhật thông tin nhân viên
   */
  @Patch(":id")
  @UsePipes(new ValidationPipe({ transform: true }))
  update(@Param("id") id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  /**
   * DELETE /api/v2/employees/:id
   * Xóa nhân viên
   */
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.employeesService.remove(id);
  }

  /**
   * PATCH /api/v2/employees/:id/password
   * Đổi mật khẩu nhân viên
   */
  @Patch(":id/password")
  @UsePipes(new ValidationPipe({ transform: true }))
  updatePassword(
    @Param("id") id: string,
    @Body() body: { newPassword: string }
  ) {
    if (!body.newPassword || body.newPassword.length < 6) {
      throw new BadRequestException("New password must be at least 6 characters long");
    }
    return this.employeesService.updatePassword(id, body.newPassword);
  }

  /**
   * PATCH /api/v2/employees/:id/deactivate
   * Vô hiệu hóa nhân viên
   */
  @Patch(":id/deactivate")
  deactivateEmployee(@Param("id") id: string) {
    return this.employeesService.deactivateEmployee(id);
  }

  /**
   * PATCH /api/v2/employees/:id/activate
   * Kích hoạt nhân viên
   */
  @Patch(":id/activate")
  activateEmployee(@Param("id") id: string) {
    return this.employeesService.activateEmployee(id);
  }
}
