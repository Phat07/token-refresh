import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateServiceDto {
  @ApiProperty({
    description: 'Tên dịch vụ',
    example: 'Cắt tóc nữ',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Giá dịch vụ',
    example: 60000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({
    description: 'Mô tả dịch vụ',
    required: false,
    example: 'Dịch vụ cắt tóc nữ chuyên nghiệp',
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
    description: 'Hình ảnh dịch vụ',
    required: false,
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  image?: string;  // This field can be used for image update
}
