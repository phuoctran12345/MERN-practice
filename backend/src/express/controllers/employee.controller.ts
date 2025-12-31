import { Request, Response } from "express";
import User from "../../models/user";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import { getIO } from "../../shared/socket";

// ============================================
// POST /api/v2/employees
// Tạo nhân viên mới (Manager)
export const createEmployee = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: "Dữ liệu không hợp lệ", 
        errors: errors.array() 
      });
    }

    const {
      companyId,
      email,
      password,
      firstName,
      lastName,
      role,
      phone,
      address,
      preferences,
      isActive,
      emailVerified,
    } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ 
        message: `Nhân viên với email ${email} đã tồn tại` 
      });
    }

    // Validate role - chỉ cho phép receptionist, manager, hotel_owner
    const allowedRoles = ["receptionist", "manager", "hotel_owner"];
    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({ 
        message: `Role không hợp lệ. Chỉ cho phép: ${allowedRoles.join(", ")}` 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 8);

    const employee = new User({
      companyId,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: role || "receptionist",
      phone,
      address,
      preferences,
      isActive: isActive !== undefined ? isActive : true,
      emailVerified: emailVerified !== undefined ? emailVerified : false,
    });

    await employee.save();

    // Remove password from response
    const employeeResponse = employee.toObject();
    delete employeeResponse.password;

    // Emit socket event để frontend re-render
    try {
      const io = getIO();
      io.emit("employee:created", {
        employee: employeeResponse,
        message: "Employee created successfully",
      });
      console.log("📡 Socket.IO: Emitted employee:created event");
    } catch (error) {
      console.warn("⚠️  Socket.IO not available:", error);
    }

    res.status(201).json({
      message: "Tạo nhân viên thành công",
      employee: employeeResponse,
    });
  } catch (error) {
    console.error("❌ Lỗi createEmployee:", error);
    res.status(500).json({ 
      message: "Lỗi khi tạo nhân viên",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// ============================================
// GET /api/v2/employees
// Lấy danh sách nhân viên với filters và pagination (Manager)
export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const { companyId, role, isActive, page = "1", limit = "10" } = req.query;

    const query: any = {};
    
    // Filter by companyId (nếu có)
    if (companyId) {
      query.companyId = companyId as string;
    }
    
    // Filter by role (chỉ lấy employees, không lấy customer)
    const employeeRoles = ["receptionist", "manager", "hotel_owner"];
    if (role) {
      if (employeeRoles.includes(role as string)) {
        query.role = role as string;
      } else {
        return res.status(400).json({ 
          message: `Role không hợp lệ. Chỉ cho phép: ${employeeRoles.join(", ")}` 
        });
      }
    } else {
      // Nếu không có role filter, chỉ lấy employees
      query.role = { $in: employeeRoles };
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;
    
    const [employees, total] = await Promise.all([
      User.find(query)
        .select("-password") // Exclude password from response
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .exec(),
      User.countDocuments(query).exec(),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      message: "Lấy danh sách nhân viên thành công",
      employees,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
      },
    });
  } catch (error) {
    console.error("❌ Lỗi getAllEmployees:", error);
    res.status(500).json({ 
      message: "Lỗi khi lấy danh sách nhân viên",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// ============================================
// GET /api/v2/employees/:id
// Lấy thông tin một nhân viên cụ thể
export const getEmployeeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const employee = await User.findById(id).select("-password");
    if (!employee) {
      return res.status(404).json({ 
        message: `Không tìm thấy nhân viên với ID ${id}` 
      });
    }

    // Kiểm tra xem có phải employee không
    const employeeRoles = ["receptionist", "manager", "hotel_owner"];
    if (!employeeRoles.includes(employee.role || "")) {
      return res.status(400).json({ 
        message: `User với ID ${id} không phải là nhân viên` 
      });
    }

    res.status(200).json({
      message: "Lấy thông tin nhân viên thành công",
      employee,
    });
  } catch (error) {
    console.error("❌ Lỗi getEmployeeById:", error);
    res.status(500).json({ 
      message: "Lỗi khi lấy thông tin nhân viên",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// ============================================
// PATCH /api/v2/employees/:id
// Cập nhật nhân viên (Manager)
export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: "Dữ liệu không hợp lệ", 
        errors: errors.array() 
      });
    }

    const { id } = req.params;
    const updateData = req.body;

    const existingEmployee = await User.findById(id);
    if (!existingEmployee) {
      return res.status(404).json({ 
        message: `Không tìm thấy nhân viên với ID ${id}` 
      });
    }

    // Kiểm tra xem có phải employee không
    const employeeRoles = ["receptionist", "manager", "hotel_owner"];
    if (!employeeRoles.includes(existingEmployee.role || "")) {
      return res.status(400).json({ 
        message: `User với ID ${id} không phải là nhân viên` 
      });
    }

    // Check if email is being updated and if it already exists
    if (updateData.email && updateData.email !== existingEmployee.email) {
      const emailExists = await User.findOne({ 
        email: updateData.email,
        _id: { $ne: id } // Exclude current employee
      });
      
      if (emailExists) {
        return res.status(409).json({ 
          message: `Nhân viên với email ${updateData.email} đã tồn tại` 
        });
      }
    }

    // Validate role nếu có update
    if (updateData.role) {
      const allowedRoles = ["receptionist", "manager", "hotel_owner"];
      if (!allowedRoles.includes(updateData.role)) {
        return res.status(400).json({ 
          message: `Role không hợp lệ. Chỉ cho phép: ${allowedRoles.join(", ")}` 
        });
      }
    }

    // Không cho phép update password qua endpoint này (dùng endpoint riêng)
    delete updateData.password;

    const updatedEmployee = await User.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedEmployee) {
      return res.status(404).json({ 
        message: `Không tìm thấy nhân viên với ID ${id}` 
      });
    }

    // Emit socket event
    try {
      const io = getIO();
      io.emit("employee:updated", {
        employee: updatedEmployee,
        message: "Employee updated successfully",
      });
      console.log("📡 Socket.IO: Emitted employee:updated event");
    } catch (error) {
      console.warn("⚠️  Socket.IO not available:", error);
    }

    res.status(200).json({
      message: "Cập nhật nhân viên thành công",
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error("❌ Lỗi updateEmployee:", error);
    res.status(500).json({ 
      message: "Lỗi khi cập nhật nhân viên",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// ============================================
// DELETE /api/v2/employees/:id
// Xóa nhân viên (Manager) - Thực tế là deactivate
export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const employee = await User.findById(id);
    if (!employee) {
      return res.status(404).json({ 
        message: `Không tìm thấy nhân viên với ID ${id}` 
      });
    }

    // Kiểm tra xem có phải employee không
    const employeeRoles = ["receptionist", "manager", "hotel_owner"];
    if (!employeeRoles.includes(employee.role || "")) {
      return res.status(400).json({ 
        message: `User với ID ${id} không phải là nhân viên` 
      });
    }

    // Thực tế không xóa, chỉ deactivate
    const deactivatedEmployee = await User.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    ).select("-password");

    // Emit socket event
    try {
      const io = getIO();
      io.emit("employee:deleted", {
        employeeId: id,
        employee: deactivatedEmployee,
        message: "Employee deactivated successfully",
      });
      console.log("📡 Socket.IO: Emitted employee:deleted event");
    } catch (error) {
      console.warn("⚠️  Socket.IO not available:", error);
    }

    res.status(200).json({
      message: `Vô hiệu hóa nhân viên với ID ${id} thành công`,
    });
  } catch (error) {
    console.error("❌ Lỗi deleteEmployee:", error);
    res.status(500).json({ 
      message: "Lỗi khi xóa nhân viên",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// ============================================
// PATCH /api/v2/employees/:id/password
// Đổi mật khẩu nhân viên (Manager)
export const updateEmployeePassword = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: "Dữ liệu không hợp lệ", 
        errors: errors.array() 
      });
    }

    const { id } = req.params;
    const { newPassword } = req.body;

    const employee = await User.findById(id);
    if (!employee) {
      return res.status(404).json({ 
        message: `Không tìm thấy nhân viên với ID ${id}` 
      });
    }

    // Kiểm tra xem có phải employee không
    const employeeRoles = ["receptionist", "manager", "hotel_owner"];
    if (!employeeRoles.includes(employee.role || "")) {
      return res.status(400).json({ 
        message: `User với ID ${id} không phải là nhân viên` 
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 8);

    await User.findByIdAndUpdate(id, { 
      password: hashedPassword,
      updatedAt: new Date()
    });

    res.status(200).json({
      message: "Đổi mật khẩu nhân viên thành công",
    });
  } catch (error) {
    console.error("❌ Lỗi updateEmployeePassword:", error);
    res.status(500).json({ 
      message: "Lỗi khi đổi mật khẩu nhân viên",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// ============================================
// PATCH /api/v2/employees/:id/activate
// Kích hoạt nhân viên (Manager)
export const activateEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const employee = await User.findById(id);
    if (!employee) {
      return res.status(404).json({ 
        message: `Không tìm thấy nhân viên với ID ${id}` 
      });
    }

    const updatedEmployee = await User.findByIdAndUpdate(
      id,
      { isActive: true, updatedAt: new Date() },
      { new: true }
    ).select("-password");

    if (!updatedEmployee) {
      return res.status(404).json({ 
        message: `Không tìm thấy nhân viên với ID ${id}` 
      });
    }

    // Emit socket event
    try {
      const io = getIO();
      io.emit("employee:activated", {
        employee: updatedEmployee,
        message: "Employee activated successfully",
      });
      console.log("📡 Socket.IO: Emitted employee:activated event");
    } catch (error) {
      console.warn("⚠️  Socket.IO not available:", error);
    }

    res.status(200).json({
      message: "Kích hoạt nhân viên thành công",
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error("❌ Lỗi activateEmployee:", error);
    res.status(500).json({ 
      message: "Lỗi khi kích hoạt nhân viên",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// ============================================
// GET /api/v2/employees/role/:role
// Lấy danh sách nhân viên theo role (Manager)
export const getEmployeesByRole = async (req: Request, res: Response) => {
  try {
    const { role } = req.params;
    const { companyId } = req.query;

    const employeeRoles = ["receptionist", "manager", "hotel_owner"];
    if (!employeeRoles.includes(role)) {
      return res.status(400).json({ 
        message: `Role không hợp lệ. Chỉ cho phép: ${employeeRoles.join(", ")}` 
      });
    }

    const query: any = { role, isActive: true };
    
    if (companyId) {
      query.companyId = companyId as string;
    }

    const employees = await User.find(query)
      .select("-password")
      .sort({ firstName: 1, lastName: 1 })
      .exec();

    res.status(200).json({
      message: `Lấy danh sách nhân viên với role ${role} thành công`,
      count: employees.length,
      employees,
    });
  } catch (error) {
    console.error("❌ Lỗi getEmployeesByRole:", error);
    res.status(500).json({ 
      message: "Lỗi khi lấy danh sách nhân viên theo role",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

