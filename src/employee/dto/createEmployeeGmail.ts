import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateEmployeeGmailDto {
  @ApiProperty({
    description: 'id of the employee',
    example: 'idEmployee',
  })
  @IsString()
  employeeId: string;

  @ApiProperty({
    description: 'Gmail of the employee',
    required: false,
    example: 'employee@example.com',
  })
  @IsEmail()
  gmail: string;
}
