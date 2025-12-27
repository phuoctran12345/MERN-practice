import { PartialType, OmitType } from "@nestjs/mapped-types";
import { CreateEmployeeDto } from "./create-employee.dto";

// Omit password from update DTO for security
export class UpdateEmployeeDto extends PartialType(
  OmitType(CreateEmployeeDto, ["password"] as const)
) {}
