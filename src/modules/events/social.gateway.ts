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
import { PostService } from '../post/post.service';
import { CommentService } from '../comment/comment.service';
import { Comment } from '../comment/schema';
import { CheckChanalPipe } from '../../common/pipes';
import { ReactWithPipe } from './pipes';

@WebSocketGateway({ namespace: 'social' })
@UseFilters(WsExceptionFilter, MongooseValidationErrorExceptionFilter)
export class SocialGateway {
  constructor(
    private readonly postService: PostService,
    private readonly commentService: CommentService,
  ) {}

  @WebSocketServer()
  private server: Server;

  @SubscribeMessage('join')
  hendleJoin(@ConnectedSocket() client: Socket, @MessageBody() room: string) {
    client.join(room, function onJoin() {
      //notifies the client that he has joined the room
      client.emit('join', 'you has joined the room');
    });
  }

  @SubscribeMessage('typing')
  handleTyping(@MessageBody() room: string) {
    //notifies all participants that someone is typing a comment
    this.server.to(room).emit('typing');
  }

  @SubscribeMessage('reactWith')
  @UsePipes(ReactWithPipe)
  async handleReactWith(@MessageBody() { chanal, type: reaction, ...react }) {
    const reactWith = await this.postService.reactWith(react, reaction);
    //notifies all participants that someone interacted on a post
    this.server.to(chanal).emit('reactWith', reactWith);
  }

  @SubscribeMessage('createComment')
  @UsePipes(CheckChanalPipe)
  async handleCreateComment(@MessageBody() commentData: Comment) {
    const comment = await this.commentService.createComment(commentData);
    //notify all participants who are viewing the post
    this.server.to(comment.chanal).emit('createComment', comment);
  }
}
