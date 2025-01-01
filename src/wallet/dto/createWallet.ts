import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWalletDto {
  @ApiProperty({
    description: 'Thông tin nạp tiền',
    example: '....',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'url success',
    example: '....',
  })
  @IsString()
  @IsNotEmpty()
  returnUrl: string;

  @ApiProperty({
    description: 'url cancel',
    example: '....',
  })
  @IsString()
  @IsNotEmpty()
  cancelUrl: string;

  @ApiProperty({
    description: 'Số tiền cần nạp',
    example: 50000,
  })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({
    description: 'ID của khách hàng',
    example: 1,
  })
  @IsNotEmpty()
  userId: string;
}
