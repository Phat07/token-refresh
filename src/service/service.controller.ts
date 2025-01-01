import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateServiceDto } from './dto/createService';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/api/v1')
export class ServiceController {
  constructor(private serviceService: ServiceService) {}

  @Post('/services')
  @ApiOperation({ summary: 'Tạo dịch vụ mới' })
  @ApiBody({
    description: 'Thông tin dịch vụ',
    type: CreateServiceDto,
  })
  @ApiConsumes('multipart/form-data') // Nếu có upload file
  @UseInterceptors(FileInterceptor('image'))
  async createService(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    return this.serviceService.createService(body, file);
  }

  @Get('/services/:salonId')
  @ApiOperation({ summary: 'Lấy danh sách dịch vụ theo salon với phân trang' })
  async getServicesBySalon(
    @Param('salonId') salonId: string,
    @Query('page') page: string, // Nhận tham số page từ query string
    @Query('limit') limit: string, // Nhận tham số limit từ query string
  ) {
    // Chuyển đổi page và limit sang số nguyên, với giá trị mặc định
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;

    return this.serviceService.getServicesBySalon(
      salonId,
      pageNumber,
      limitNumber,
    );
  }
  @Put('/services/:id')
  @ApiOperation({
    summary: 'Cập nhật dịch vụ',
    description: 'API để tạo salon mới với thông tin chi tiết',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Thông tin salon',
    type: CreateServiceDto,
  })
  @UseInterceptors(FileInterceptor('image'))
  async updateService(
    @Param('id') id: string,
    @Body() updateData: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.serviceService.updateService(id, updateData, file);
  }

  @Delete('/services/:id')
  @ApiOperation({ summary: 'Xóa dịch vụ' })
  async deleteService(@Param('id') id: string) {
    return this.serviceService.deleteService(id);
  }
}
