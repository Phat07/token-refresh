import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

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

export class CreateSalonDto {
  @ApiProperty({ description: 'Tên salon', type: 'string' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Địa chỉ salon', type: 'string' })
  @IsString()
  address: string;

  @ApiProperty({ description: 'Kinh độ', type: 'number' })
  @IsNumber()
  lat: number;

  @ApiProperty({ description: 'Vĩ độ', type: 'number' })
  @IsNumber()
  lng: number;

  @ApiProperty({
    description: 'Giờ mở cửa',
    required: false,
    type: () => OpeningHours, // Ensure Swagger recognizes it as a nested object
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => OpeningHours)
  openingHours?: OpeningHours;

  @ApiProperty({
    description: 'Hình ảnh salon',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  image?: string;
}
