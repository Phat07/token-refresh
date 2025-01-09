import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { User } from './users/entities/user.entity';
import { Role } from './roles/entities/role.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenModule } from './token/token.module';
import { Token } from './token/entities/token.entity';
import { OtpModule } from './otp/otp.module';
import { Otp } from './otp/entities/otp.entity';
import { SalonModule } from './salon/salon.module';
import { ServiceModule } from './service/service.module';
import { VoucherModule } from './voucher/voucher.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { Salon } from './salon/entities/salon.entity';
import { Service } from './service/entities/service.entity';
import { Voucher } from './voucher/entities/voucher.entity';
import { EmployeeModule } from './employee/employee.module';
import { CustomerModule } from './customer/customer.module';
import { OwnerModule } from './owner/owner.module';
import { AdminModule } from './admin/admin.module';
import { WalletModule } from './wallet/wallet.module';
import { Employee } from './employee/entities/employee.entity';
import { Wallet } from './wallet/entities/wallet.entity';
import { Customer } from './customer/entities/customer.entity';
import { Owner } from './owner/entities/owner.entity';
import { Admin } from './admin/entities/admin.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Để sử dụng ConfigService ở mọi nơi
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        url: configService.get('DATABASE_URL'),
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE_NAME'),
        // entities: [
        //   User,
        //   Role,
        //   Token,
        //   Otp,
        //   Salon,
        //   Service,
        //   Voucher,
        //   Employee,
        //   Wallet,
        //   Customer,
        //   Owner,
        //   Admin,
        // ],
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: true,
        logger: 'advanced-console',
        ssl:
          process.env.NODE_ENV === 'production'
            ? {
                rejectUnauthorized: false,
              }
            : undefined,
        // Optimized connection handling
        retryAttempts: 3,
        retryDelay: 3000,
        connectTimeout: 20000,
        extra: {
          connectionLimit: 10,
          waitForConnections: true,
          queueLimit: 0,
        },
        // Proper connection pool configuration for MySQL2
        poolSize: undefined, // Remove deprecated option
        pool: {
          max: 10,
          min: 2,
          idle: 10000,
        },
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
