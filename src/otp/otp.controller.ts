import { Body, Controller, Post } from '@nestjs/common';
import { OtpService } from './otp.service';
import { ApiBadRequestResponse, ApiOperation } from '@nestjs/swagger';
import { SendOtpDto } from './dto/sendOtp.dto';
import { CheckOtpDto } from './dto/checkOtp.dto';

@Controller('/api/v1/otp')
export class OtpController {
  constructor(private otpService: OtpService) {}

  @Post('')
  @ApiOperation({ summary: 'Gửi otp' })
  @ApiBadRequestResponse({
    description: 'Dữ liệu đầu vào không hợp lệ.',
  })
  sendOtp(@Body() requestBody: SendOtpDto) {
    return this.otpService.checkEmailAndSendOtp(requestBody);
  }

  @Post('/checkOtp')
  @ApiOperation({ summary: 'Kiểm tra otp' })
  @ApiBadRequestResponse({
    description: 'Dữ liệu đầu vào không hợp lệ.',
  })
  checkOtp(@Body() requestBody: CheckOtpDto) {
    return this.otpService.checkOtp(requestBody);
  }
}
