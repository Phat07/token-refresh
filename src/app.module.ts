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
import { UsersModule } from './users/users.module';
import { VoucherModule } from './voucher/voucher.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.development'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        driver: require('mysql2'),
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        synchronize: false,
        logging: ['error', 'warn'],
        ssl: {
          rejectUnauthorized: false,
        },
        extra: {
          connectionLimit: 10,
          waitForConnections: true,
        },
        retryAttempts: 3,
        retryDelay: 3000,
        connectTimeout: 30000,
      }),
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
  ],
})
export class AppModule {}
