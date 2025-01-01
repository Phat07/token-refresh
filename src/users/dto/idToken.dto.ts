import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class IdTokenDto {
  @ApiProperty({
    example: 'token',
    description: 'idToken từ google oauth',
    required: true,
  })
  @IsNotEmpty()
  token: string;
}
