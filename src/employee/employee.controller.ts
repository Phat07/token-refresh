import { Body, Controller, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { CreateEmployeeDto } from './dto/createEmployee';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateEmployeeDto } from './dto/updateEmployee';
import { CreateEmployeeGmailDto } from './dto/createEmployeeGmail';

@Controller('/api/v1')
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}
  //   @ApiConsumes('multipart/form-data')
  //   @ApiBody({
  //     description: 'Thông tin nhân viên',
  //     type: CreateEmployeeDto,
  //   })
  //   @UseInterceptors(FileInterceptor('image'))
  @Post('/emplyee')
  @ApiOperation({
    summary: 'Tạo mới thông tin nhân viên',
    description: 'API để tạo employee mới với thông tin chi tiết',
  })
  @ApiBadRequestResponse({
    description: 'Dữ liệu đầu vào không hợp lệ.',
  })
  async createInformationEmployee(@Body() requestBody: CreateEmployeeDto) {
    return this.employeeService.register(requestBody);
  }

  @Put('/emplyee/:id')
  @ApiOperation({
    summary: 'Cập nhật dịch vụ',
    description: 'API để tạo salon mới với thông tin chi tiết',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Thông tin salon',
    type: UpdateEmployeeDto,
  })
  @UseInterceptors(FileInterceptor('image'))
  async updateService(
    @Param('id') id: string,
    @Body() updateData: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.employeeService.updateEmployee(id, updateData, file);
  }

  @Post('/createEmplyee')
  @ApiOperation({
    summary: 'Tạo mới thông tin nhân viên',
    description: 'API để tạo employee mới với thông tin chi tiết',
  })
  @ApiBadRequestResponse({
    description: 'Dữ liệu đầu vào không hợp lệ.',
  })
  async createEmployee(@Body() requestBody: CreateEmployeeGmailDto) {
    return this.employeeService.activateEmployeeAccount(requestBody);
  }
}
