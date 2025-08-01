import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../entities/user.entity';

export const WsCurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const client = ctx.switchToWs().getClient();
    return client.data.user;
  },
); 