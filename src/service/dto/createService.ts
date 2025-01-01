import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({
    description: 'Tên dịch vụ',
    example: 'Cắt tóc nam',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Giá dịch vụ',
    example: 50000,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Mô tả dịch vụ',
    required: false,
    example: 'Dịch vụ cắt tóc chuyên nghiệp',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Thời gian dịch vụ (phút)',
    required: false,
    example: 30,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  duration?: number;

  @ApiProperty({
    description: 'ID của salon',
    example: 1,
  })
  @IsNotEmpty()
  salonId: string;

  @ApiProperty({
    description: 'Hình ảnh salon',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  image?: string;
}
