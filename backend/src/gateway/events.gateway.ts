import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class EventsGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  afterInit() {
    console.log('Socket.io gateway initialised');
  }

  broadcastStateChange() {
    this.server.emit('state:changed', { updatedAt: new Date().toISOString() });
  }
}
