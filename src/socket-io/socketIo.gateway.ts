import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketIoService } from './socket-io.service';

@WebSocketGateway({ cors: true }) // Cho phép kết nối từ mọi nguồn
export class SocketIoGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly socketIoService: SocketIoService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(client: Socket, payload: { message: string }) {
    console.log(`Received message: ${payload.message}`);

    // Broadcast tin nhắn đến tất cả client
    this.server.emit('newMessage', payload);
  }
}
