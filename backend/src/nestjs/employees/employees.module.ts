import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { EmployeesService } from "./employees.service";
import { EmployeesController } from "./employees.controller";
import { Employee, EmployeeSchema } from "./schemas/employee.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Employee.name, schema: EmployeeSchema }]),
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService], // Export if other modules need to use EmployeesService
})
export class EmployeesModule {}
