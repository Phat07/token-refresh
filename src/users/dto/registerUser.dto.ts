// src/users/dto/register-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
import { UserRole } from 'src/roles/enums/role.enum';

export class RegisterUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email của người dùng',
    required: true
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Tên người dùng',
    required: true
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Password123',
    description: 'Mật khẩu của người dùng',
    required: true
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.CUSTOMER, // Giả sử UserRole.USER là một giá trị trong enum
    description: 'Role của người dùng',
    required: true
  })
  @IsNotEmpty()
  @IsEnum(UserRole)  // Thêm validator để đảm bảo giá trị thuộc enum
  roleName: UserRole;
}