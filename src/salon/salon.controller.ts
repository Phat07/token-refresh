import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SalonService } from './salon.service';

import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CreateSalonDto } from './dto/createSalon.dto';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';

@Controller('/api/v1')
export class SalonController {
  constructor(
    private salonService: SalonService,
  ) {}

  @Post("/salons")
  @ApiOperation({ 
    summary: 'Tạo mới salon', 
    description: 'API để tạo salon mới với thông tin chi tiết' 
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Thông tin salon',
    type: CreateSalonDto
  })
  @UseInterceptors(FileInterceptor('image'))
  async createSalon(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any
  ) {
    return this.salonService.createSalonApi(body, file);
  }
}
