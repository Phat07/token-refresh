import { forwardRef, Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { Wallet } from './entities/wallet.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayosService } from './PayOs.service';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/services/users/users.service';

import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';
import { ConfigService } from '@nestjs/config';
import { Transaction } from 'src/transaction/entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet, User, Role, Transaction]), // Đăng ký Wallet entity
    forwardRef(() => UsersModule), // Import UsersModule để sử dụng UserRepository
  ],
  controllers: [WalletController],
  providers: [WalletService, PayosService, UsersService],
  exports: [WalletService, PayosService, TypeOrmModule],
})
export class WalletModule {}
