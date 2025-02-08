import { Module } from '@nestjs/common';
import { SocketIoController } from './socket-io.controller';
import { SocketIoService } from './socket-io.service';
import { SocketIoGateway } from './socketIo.gateway';

@Module({
  controllers: [SocketIoController],
  providers: [SocketIoService, SocketIoGateway],
})
export class SocketIoModule {}
