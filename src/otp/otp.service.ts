import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Otp } from './entities/otp.entity';
import { MailService } from './mail/mail.service';
import { SendOtpDto } from './dto/sendOtp.dto';
import { CheckOtpDto } from './dto/checkOtp.dto';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Otp) private otpRepo: Repository<Otp>,
    private mailService: MailService,
  ) {}

  // API Kiểm tra email và gửi OTP
  async checkEmailAndSendOtp(requestBody: SendOtpDto) {
    const { email } = requestBody;

    // Kiểm tra xem email đã tồn tại trong hệ thống chưa
    const user = await this.userRepo.findOne({ where: { email } });
    if (user) {
      throw new Error('Người dùng đã tồn tại trong hệ thống');
    }

    // Tạo OTP và lưu vào cơ sở dữ liệu
    const otpCode = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5); // Hết hạn sau 5 phút

    // Tạo một đối tượng OTP mới với Gmail được lưu
    const otp = this.otpRepo.create({
      otpCode,
      expiresAt,
      email, // Lưu email vào cột gmail
    });
    await this.otpRepo.save(otp);

    // Gửi OTP qua email
    await this.mailService.sendOtpEmail(email, otpCode);

    return 'OTP đã được gửi đến email của bạn.';
  }

  // API Kiểm tra OTP
  async checkOtp(requestBody: CheckOtpDto) {
    // Kiểm tra OTP trong cơ sở dữ liệu với email
    const otpCode = requestBody.otp;
    const email = requestBody.email;
    const otp = await this.otpRepo.findOne({
      where: { otpCode, email }, // So sánh cả mã OTP và email
    });

    if (!otp) {
      throw new Error('Mã OTP không hợp lệ hoặc email không đúng');
    }

    // Kiểm tra xem OTP có hết hạn không (2 phút)
    const now = new Date();
    if (otp.expiresAt < now) {
      return { success: false, message: 'Mã OTP đã hết hạn' };
    }

    // Kiểm tra xem OTP có được xác thực chưa
    if (otp.isVerified) {
      return { success: false, message: 'Mã OTP đã được xác nhận trước đó' };
    }

    // Cập nhật trạng thái OTP thành "đã xác nhận"
    otp.isVerified = true;
    await this.otpRepo.save(otp);

    // Kiểm tra email có tồn tại trong hệ thống không
    // const user = await this.userRepo.findOne({ where: { email } });
    // if (!user) {
    //   throw new Error('Email không tồn tại trong hệ thống');
    // }

    return { success: true, message: 'OTP hợp lệ và đã được xác nhận.' };
  }
}
