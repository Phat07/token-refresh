import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    example: '****',
    description: 'Điền token vào đây',
    required: true,
  })
  @IsNotEmpty()
  refreshToken: string;
}
