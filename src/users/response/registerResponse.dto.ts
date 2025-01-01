// src/users/dto/user-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/roles/enums/role.enum';

export class RegisterResponseDto {
  @ApiProperty({
    example: 1,
    description: 'ID của user'
  })
  id: number;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email của user'
  })
  email: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Tên của user'
  })
  name: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.CUSTOMER,
    description: 'Role của user'
  })
  roleName: UserRole;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token'
  })
  access_token: string;
}