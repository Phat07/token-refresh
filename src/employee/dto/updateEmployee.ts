import {
  IsString,
  IsEmail,
  IsOptional,
  IsArray,
  IsBoolean,
  ValidateNested,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { EnumGender } from '../enums/gender.enum';
class OpeningHours {
  @ApiProperty({ type: 'string', example: '8:00-17:00', required: false })
  monday?: string;

  @ApiProperty({ type: 'string', example: '8:00-17:00', required: false })
  tuesday?: string;

  @ApiProperty({ type: 'string', example: '8:00-17:00', required: false })
  wednesday?: string;

  @ApiProperty({ type: 'string', example: '8:00-17:00', required: false })
  thursday?: string;

  @ApiProperty({ type: 'string', example: '8:00-17:00', required: false })
  friday?: string;

  @ApiProperty({ type: 'string', example: '8:00-17:00', required: false })
  saturday?: string;

  @ApiProperty({ type: 'string', example: '8:00-17:00', required: false })
  sunday?: string;
}
export class UpdateEmployeeDto {
  @ApiProperty({
    description: 'Gmail of the employee',
    required: false,
    example: 'employee@example.com',
  })
  @IsEmail()
  gmail: string;

  @ApiProperty({
    description: 'Username of the employee',
    example: 'john_doe',
  })
  @IsString()
  username: string;

  @ApiProperty({
    enum: EnumGender,
    example: EnumGender.OTHER, // Giả sử UserRole.USER là một giá trị trong enum
    description: 'Giới tính nhân viên',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(EnumGender) // Thêm validator để đảm bảo giá trị thuộc enum
  gender: EnumGender;

  @ApiProperty({
    description: 'Image URL of the employee',
    required: false,
    example: 'https://cloudinary.com/employee_image.jpg',
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({
    description: 'Giờ mở cửa',
    required: false,
    type: () => OpeningHours, // Ensure Swagger recognizes it as a nested object
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => OpeningHours)
  workSchedule?: OpeningHours;

  @ApiProperty({
    description: 'Salon ID the employee works for',
    example: 1,
  })
  salonId: string;

  @ApiProperty({
    description: 'List of service IDs the employee can perform',
    example: ['id service1', 'id service2', 'id service3'],
  })
  @IsArray()
  @IsOptional()
  serviceIds?: string[];
}
