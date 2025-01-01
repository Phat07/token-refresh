import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendOtpDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email của người dùng',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

}
