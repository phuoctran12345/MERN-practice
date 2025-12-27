import { Injectable, NotFoundException, BadRequestException, ConflictException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Employee, EmployeeDocument } from "./schemas/employee.schema";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import * as bcrypt from "bcryptjs";

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    // Check if email already exists
    const existingEmployee = await this.employeeModel.findOne({ email: createEmployeeDto.email });
    if (existingEmployee) {
      throw new ConflictException(`Employee with email ${createEmployeeDto.email} already exists`);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createEmployeeDto.password, 8);

    const createdEmployee = new this.employeeModel({
      ...createEmployeeDto,
      password: hashedPassword,
    });

    return createdEmployee.save();
  }

  async findAll(
    companyId?: string,
    role?: string,
    isActive?: boolean,
    page: number = 1,
    limit: number = 10
  ): Promise<{ employees: Employee[]; total: number; page: number; totalPages: number }> {
    const query: any = {};
    
    if (companyId) {
      query.companyId = companyId;
    }
    
    if (role) {
      query.role = role;
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive;
    }

    const skip = (page - 1) * limit;
    
    const [employees, total] = await Promise.all([
      this.employeeModel
        .find(query)
        .select("-password") // Exclude password from response
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.employeeModel.countDocuments(query).exec(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      employees,
      total,
      page,
      totalPages,
    };
  }

  async findOne(id: string): Promise<Employee> {
    const employee = await this.employeeModel
      .findById(id)
      .select("-password") // Exclude password from response
      .exec();
    
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    
    return employee;
  }

  async findByEmail(email: string): Promise<Employee | null> {
    return this.employeeModel.findOne({ email }).exec();
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
    const existingEmployee = await this.employeeModel.findById(id);
    if (!existingEmployee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    // Check if email is being updated and if it already exists
    if (updateEmployeeDto.email && updateEmployeeDto.email !== existingEmployee.email) {
      const emailExists = await this.employeeModel.findOne({ 
        email: updateEmployeeDto.email,
        _id: { $ne: id } // Exclude current employee
      });
      
      if (emailExists) {
        throw new ConflictException(`Employee with email ${updateEmployeeDto.email} already exists`);
      }
    }

    const updatedEmployee = await this.employeeModel
      .findByIdAndUpdate(id, updateEmployeeDto, { new: true })
      .select("-password") // Exclude password from response
      .exec();
    
    if (!updatedEmployee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    
    return updatedEmployee;
  }

  async remove(id: string): Promise<any> {
    const result = await this.employeeModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return { message: `Employee with ID ${id} deleted successfully` };
  }

  async updatePassword(id: string, newPassword: string): Promise<Employee> {
    const employee = await this.employeeModel.findById(id);
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 8);

    const updatedEmployee = await this.employeeModel
      .findByIdAndUpdate(id, { password: hashedPassword }, { new: true })
      .select("-password") // Exclude password from response
      .exec();

    return updatedEmployee!;
  }

  async deactivateEmployee(id: string): Promise<Employee> {
    const updatedEmployee = await this.employeeModel
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .select("-password")
      .exec();
    
    if (!updatedEmployee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    
    return updatedEmployee;
  }

  async activateEmployee(id: string): Promise<Employee> {
    const updatedEmployee = await this.employeeModel
      .findByIdAndUpdate(id, { isActive: true }, { new: true })
      .select("-password")
      .exec();
    
    if (!updatedEmployee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    
    return updatedEmployee;
  }

  async getEmployeesByRole(role: string, companyId?: string): Promise<Employee[]> {
    const query: any = { role, isActive: true };
    
    if (companyId) {
      query.companyId = companyId;
    }

    return this.employeeModel
      .find(query)
      .select("-password")
      .sort({ firstName: 1, lastName: 1 })
      .exec();
  }
}
