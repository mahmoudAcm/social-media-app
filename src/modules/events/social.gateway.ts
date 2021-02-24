import { UseFilters, UsePipes } from '@nestjs/common';
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
import { PostHandlerPayload } from './interfaces';
import { ValidatePostHandlerPayloadPipe } from './pipes';

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

  /**
   * Notifies with a given payload all users that subscribed to a given post
   * and sends a notification to the owner of that post
   */
  @SubscribeMessage('post')
  @UsePipes(ValidatePostHandlerPayloadPipe)
  handlePost(@MessageBody() { room, ...payload }: PostHandlerPayload) {
    this.server.to(room).emit('post', payload);
    this.server.to(payload[payload.type].owner).emit('notification', payload);
  }
}
