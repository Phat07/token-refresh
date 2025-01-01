import { Body, Controller, Post } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { CreateWalletDto } from './dto/createWallet';
import { PayosService } from './PayOs.service';

@Controller('/api/v1')
export class WalletController {
  constructor(
    private walletService: WalletService,
    private payosService: PayosService,
  ) {}

  @Post('/wallets')
  @ApiOperation({ summary: 'Tạo thanh toán mới' })
  @ApiBody({
    description: 'Thông tin thanh toán',
    type: CreateWalletDto,
  })
  async createWallet(@Body() requestBody: CreateWalletDto) {
    return this.walletService.createPaymentLink(requestBody);
  }

  @Post('/webhook')
  async handleWebhook(@Body() webhookData: any) {
    return this.payosService.handleWebhook(webhookData);
  }
}
