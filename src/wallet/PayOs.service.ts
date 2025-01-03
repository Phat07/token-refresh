import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import PayOS = require('@payos/node');
import { WalletService } from './wallet.service'; // Giả sử bạn có WalletService để cập nhật ví

@Injectable()
export class PayosService {
  private payos: any;

  constructor(
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => WalletService))
    private readonly walletService: WalletService,
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
      const response = await this.payos.createPaymentLink(body);
      console.log('Payment link response:', response);

      return response;
    } catch (error) {
      console.error('Error creating payment link:', error);
      throw new Error(`Error creating payment link: ${error.message}`);
    }
  }

  // Xử lý webhook từ PayOS
  async handleWebhook(webhookData: any) {
    try {
      console.log('Webhook data received:', webhookData);

      // Kiểm tra trạng thái thanh toán từ webhook
      if (webhookData.status === 'success') {
        // Giả sử webhook trả về `userId` và `amount`
        const { userId, amount } = webhookData;

        // Cập nhật số dư ví của người dùng
        await this.walletService.updateWalletBalance(userId, amount);

        return {
          error: 0,
          message: 'Payment successful, wallet updated',
        };
      } else {
        return {
          error: 1,
          message: 'Payment failed or invalid data',
        };
      }
    } catch (error) {
      console.error('Error handling webhook:', error);
      return {
        error: 1,
        message: 'Internal server error',
      };
    }
  }
}
