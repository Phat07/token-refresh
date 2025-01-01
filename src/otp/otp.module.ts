import { Module } from '@nestjs/common';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { User } from 'src/users/entities/user.entity';
import { MailService } from './mail/mail.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Otp, User])],
  controllers: [OtpController],
  providers: [OtpService, MailService],
})
export class OtpModule {}
