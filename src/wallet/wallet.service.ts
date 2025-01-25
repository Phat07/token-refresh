import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import PayOS from '@payos/node';
import { CreateWalletDto } from './dto/createWallet';
import { PayosService } from './PayOs.service';
import { Transaction } from 'src/transaction/entities/transaction.entity';
@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,    
    @Inject(forwardRef(() => PayosService))
    private readonly payosService: PayosService,
  ) {}
  async createPaymentLink(body: CreateWalletDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: body.userId },
      });
      if (!user) {
        throw new BadRequestException('Không tìm thấy khách hàng!');
      }
      const orderCode = Number(String(new Date().getTime()).slice(-6));
      const paymentLinkRes = await this.payosService.createPaymentLink({
        orderCode,
        amount: body.amount,
        description: body.description,
        cancelUrl: body.cancelUrl,
        returnUrl: body.returnUrl,
      });
      const transaction = this.transactionRepository.create({
        wallet: user.wallet,
        amount: body.amount,
        type: 'pending',
        orderCode
      });
      await this.transactionRepository.save(transaction);
      //   const wallet = this.walletRepository.create({
      //     user, // Gán đối tượng user trực tiếp
      //     description: body.description,
      //     balance: paymentLinkRes?.balance, // Ví mới có thể khởi tạo với số dư bằng 0
      //   });

      //   // Lưu vào cơ sở dữ liệu
      //   await this.walletRepository.save(wallet);
    //   const updatedWallet = await this.updateWalletBalance(
    //     body.userId,
    //     body.amount,
    //   );
      return {
        error: 0,
        message: 'Success',
        data: {
          bin: paymentLinkRes.bin,
          checkoutUrl: paymentLinkRes.checkoutUrl,
          accountNumber: paymentLinkRes.accountNumber,
          accountName: paymentLinkRes.accountName,
          amount: paymentLinkRes.amount,
          description: paymentLinkRes.description,
          orderCode: paymentLinkRes.orderCode,
          qrCode: paymentLinkRes.qrCode,
        //   walletBalance: updatedWallet.balance,
        },
      };
    } catch (error) {
      return {
        error: -1,
        message: 'fail',
        data: null,
      };
    }
  }
  async updateWalletBalance(userId: string, amount: number) {
    const wallet = await this.walletRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    wallet.balance += amount;
    await this.walletRepository.save(wallet);

    return wallet;
  }
}
