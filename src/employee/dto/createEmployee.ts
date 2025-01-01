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
  @IsOptional()
  @IsString()
  monday?: string;

  @ApiProperty({ type: 'string', example: '8:00-17:00', required: false })
  @IsOptional()
  @IsString()
  tuesday?: string;

  @ApiProperty({ type: 'string', example: '8:00-17:00', required: false })
  @IsOptional()
  @IsString()
  wednesday?: string;

  @ApiProperty({ type: 'string', example: '8:00-17:00', required: false })
  @IsOptional()
  @IsString()
  thursday?: string;

  @ApiProperty({ type: 'string', example: '8:00-17:00', required: false })
  @IsOptional()
  @IsString()
  friday?: string;

  @ApiProperty({ type: 'string', example: '8:00-17:00', required: false })
  @IsOptional()
  @IsString()
  saturday?: string;

  @ApiProperty({ type: 'string', example: '8:00-17:00', required: false })
  @IsOptional()
  @IsString()
  sunday?: string;
}

export class CreateEmployeeDto {

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
