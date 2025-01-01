import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CheckOtpDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email của người dùng',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '******',
    description: '6 số',
    required: true,
  })
  @IsNotEmpty()
  otp: number;
}
