import { Body, forwardRef, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import PayOS = require('@payos/node');
import { WalletService } from './wallet.service'; // Giả sử bạn có WalletService để cập nhật ví
import * as crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
@Injectable()
export class PayosService {
  private payos: any;

  constructor(
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => WalletService))
    private readonly walletService: WalletService,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {
    this.payos = new PayOS(
      this.configService.get<string>('PAYOS_CLIENT_ID'),
      this.configService.get<string>('PAYOS_API_KEY'),
      this.configService.get<string>('PAYOS_CHECKSUM_KEY'),
    );
  }

  // Tạo Payment Link
  async createPaymentLink(body: any) {
    try {
      console.log('Creating payment link with body:', body);
      console.log('ENV VARIABLES:', process.env.PAYOS_API_KEY);
      console.log(
        'PAYOS_CLIENT_ID:',
        this.configService.get<string>('PAYOS_CLIENT_ID'),
      );
      console.log(
        'PAYOS_API_KEY:',
        this.configService.get<string>('PAYOS_API_KEY'),
      );
      console.log(
        'PAYOS_CHECKSUM_KEY:',
        this.configService.get<string>('PAYOS_CHECKSUM_KEY'),
      );

      const response = await this.payos.createPaymentLink(body);
      console.log('Payment link response:', response);

      return response;
    } catch (error) {
      console.error('Error creating payment link:', error);
      throw new Error(`Error creating payment link: ${error.message}`);
    }
  }

  // Xử lý webhook từ PayOS
  async handleWebhook(@Body() webhookData: any) {
    try {
      console.log('Received Webhook:', webhookData);

      // Lấy checksum gửi từ PayOS
      const receivedChecksum = webhookData.checksum;

      // Xóa checksum khỏi dữ liệu để tính lại
      delete webhookData.checksum;

      // Chuyển dữ liệu thành chuỗi JSON chuẩn
      const dataString = JSON.stringify(webhookData);

      // Tạo checksum mới từ data và CHECKSUM_KEY
      const computedChecksum = crypto
        .createHmac(
          'sha256',
          this.configService.get<string>('PAYOS_CHECKSUM_KEY'),
        )
        .update(dataString)
        .digest('hex');

      console.log('Received Checksum:', receivedChecksum);
      console.log('Computed Checksum:', computedChecksum);

      // Kiểm tra xem checksum có khớp không
      // if (receivedChecksum !== computedChecksum) {
      //   console.log('Invalid webhook signature');
      //   return { error: 1, message: 'Invalid webhook signature' };
      // }

      // Xử lý dữ liệu webhook
      if (webhookData.desc === 'success') {
        const { orderCode, amount } = webhookData?.data;

        // Find transaction by orderCode
        const transaction = await this.transactionRepository.findOne({
          where: { orderCode },
          relations: ['wallet'],
        });
        console.log('Wallet ID:', transaction.wallet?.id);

        if (!transaction) {
          return { error: 1, message: 'Transaction not found' };
        }

        // Update wallet
        const wallet = await this.walletRepository.findOne({
          where: { id: transaction.wallet.id },
        });

        if (!wallet) {
          return { error: 1, message: 'Wallet not found' };
        }

        // wallet.balance += amount;
        // await this.walletRepository.save(wallet);
        this.walletService.updateWalletBalance(transaction.wallet.id, amount);
        // Update transaction status
        transaction.type = 'success';
        await this.transactionRepository.save(transaction);
        return {
          error: 0,
          message: 'Payment successful, wallet updated',
        };
      } else {
        return { error: 1, message: 'Payment failed or invalid data' };
      }
    } catch (error) {
      console.error('Webhook handling error:', error);
      return { error: 1, message: 'Internal server error' };
    }
  }
}
