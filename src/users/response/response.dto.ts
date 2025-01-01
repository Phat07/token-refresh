// src/common/dto/response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<T> {
  @ApiProperty({ example: 'Success message' })
  msg: string;

  @ApiProperty({ example: true })
  success: boolean;

  data?: T;
}