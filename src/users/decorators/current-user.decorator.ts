import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext /* Wrapper around the request */) => {
    return context.switchToHttp().getRequest().currentUser;
  },
);
