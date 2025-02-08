import { Injectable } from '@nestjs/common';

@Injectable()
export class SocketIoService {
  async saveMessageToDB(message: string) {
    console.log(`Saving message to DB: ${message}`);
    // Xử lý lưu tin nhắn vào database
  }
}
