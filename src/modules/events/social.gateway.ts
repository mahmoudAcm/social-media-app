import { UseFilters } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  MongooseValidationErrorExceptionFilter,
  WsExceptionFilter,
} from '../../common/filters';

@WebSocketGateway({ namespace: 'social' })
@UseFilters(WsExceptionFilter, MongooseValidationErrorExceptionFilter)
export class SocialGateway {
  @WebSocketServer()
  private server: Server;

  @SubscribeMessage('join')
  hendleJoin(@ConnectedSocket() client: Socket, @MessageBody() room: string) {
    client.join(room, function onJoin() {
      //notifies the client that he has joined the room
      client.emit('join', 'you has joined the room');
    });
  }
}
