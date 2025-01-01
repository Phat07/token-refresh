import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users/users.controller';
import { UsersService } from './services/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RolesModule } from 'src/roles/roles.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TokenModule } from 'src/token/token.module';
import { TokenService } from 'src/token/token.service';
import { Token } from 'src/token/entities/token.entity';
import { Otp } from 'src/otp/entities/otp.entity';
import { OtpService } from 'src/otp/otp.service';
import { OtpModule } from 'src/otp/otp.module';
import { MailService } from 'src/otp/mail/mail.service';
import { WalletModule } from 'src/wallet/wallet.module';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { Admin } from 'src/admin/entities/admin.entity';
import { AdminModule } from 'src/admin/admin.module';
import { OwnerModule } from 'src/owner/owner.module';
import { EmployeeModule } from 'src/employee/employee.module';
import { CustomerModule } from 'src/customer/customer.module';
import { Customer } from 'src/customer/entities/customer.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { Owner } from 'src/owner/entities/owner.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Token,
      Otp,
      Wallet,
      Admin,
      Customer,
      Employee,
      Owner,
    ]),
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1h' },
    }),
    RolesModule,
    TokenModule,
    OtpModule,
    WalletModule,
    AdminModule,
    OwnerModule,
    EmployeeModule,
    CustomerModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService, MailService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
