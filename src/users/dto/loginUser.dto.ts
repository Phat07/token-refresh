import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email của người dùng',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password123',
    description: 'Mật khẩu của người dùng',
    required: true,
  })
  @IsNotEmpty()
  password: string;
}
