import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch(Error)
export class WsExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const socket = ctx.getClient();

    switch (this.getType(exception)) {
      case 'response':
        socket.emit('exception', this.modifyExceptionResponse(exception));
        break;
      case 'errors':
        socket.emit('exception', exception);
        break;
      case 'unknown':
        socket.emit('exception', exception);
        break;
    }
  }

  private getType(exception: any) {
    const types = ['response', 'errors'];
    for (const type of types) {
      if (type in exception) return type;
    }
    return 'unknown';
  }

  private modifyExceptionResponse({ response }) {
    if (response.statusCode) {
      response.status = response.statusCode;
      delete response.statusCode;
    }
    return response;
  }
}
