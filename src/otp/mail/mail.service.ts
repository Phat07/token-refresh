import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Sử dụng Gmail, bạn có thể thay bằng SMTP của nhà cung cấp khác
      port: 465,
      secure: true, // true nếu dùng cổng 465, false nếu dùng cổng khác
      auth: {
        user: process.env.EMAIL_USER, // Email của bạn
        pass: process.env.EMAIL_PASS, // Mật khẩu ứng dụng (app password)
      },
    });
  }

  async sendOtpEmail(to: string, otpCode: number): Promise<void> {
    const mailOptions = {
      from: `${process.env.EMAIL_USER}`, // Tên và địa chỉ email gửi
      to, // Email người nhận
      subject: 'Your OTP Code', // Chủ đề email
      text: `Your OTP code is ${otpCode}. It will expire in 5 minutes.`, // Nội dung email dạng văn bản
      html: `<p>Your OTP code is <strong>${otpCode}</strong>. It will expire in 5 minutes.</p>`, // Nội dung email dạng HTML
    };

    await this.transporter.sendMail(mailOptions);
  }
}
