import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './admin/admin.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CustomerModule } from './customer/customer.module';
import { EmployeeModule } from './employee/employee.module';
import { OtpModule } from './otp/otp.module';
import { OwnerModule } from './owner/owner.module';
import { RolesModule } from './roles/roles.module';
import { SalonModule } from './salon/salon.module';
import { ServiceModule } from './service/service.module';
import { TokenModule } from './token/token.module';
import { TransactionModule } from './transaction/transaction.module';
import { UsersModule } from './users/users.module';
import { VoucherModule } from './voucher/voucher.module';
import { WalletModule } from './wallet/wallet.module';
import { ChatboxModule } from './chatbox/chatbox.module';
import { ScheduleModule } from './schedule/schedule.module';
import { EmployeeScheduleModule } from './employee-schedule/employee-schedule.module';
import { SocketIoModule } from './socket-io/socket-io.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Để sử dụng ConfigService ở mọi nơi
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        // Log để debug
        console.log('demo');

        console.log('Database Config:', {
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          database: configService.get('DB_DATABASE_NAME'),
        });

        return {
          type: 'mysql',
          driver: require('mysql2'),
          // Không dùng URL string mà dùng các tham số riêng
          host: configService.get('DB_HOST'),
          port: +configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE_NAME'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
          logging: true,
          ssl: {
            rejectUnauthorized: false, // Cần thiết cho Railway
          },
          extra: {
            connectionLimit: 5,
            waitForConnections: true,
            queueLimit: 0,
          },
          // Cấu hình retry tối ưu hơn
          retryAttempts: 5,
          retryDelay: 5000,
          connectTimeout: 60000,
          // Cấu hình pool đơn giản hơn
          pool: {
            max: 5,
            min: 1,
          },
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    RolesModule,
    TokenModule,
    OtpModule,
    SalonModule,
    ServiceModule,
    VoucherModule,
    CloudinaryModule,
    EmployeeModule,
    CustomerModule,
    OwnerModule,
    AdminModule,
    WalletModule,
    TransactionModule,
    ChatboxModule,
    ScheduleModule,
    EmployeeScheduleModule,
    SocketIoModule,
  ],
})
export class AppModule {}
