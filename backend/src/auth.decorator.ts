import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

export const CurrentUser = createParamDecorator(async (_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<{ headers: Record<string, string>; user?: unknown }>();
  const header = request.headers.authorization;
  if (!header?.startsWith('Bearer ')) throw new UnauthorizedException('Bearer token required');
  const auth = (ctx.getClass() as unknown as { authService?: AuthService }).authService;
  if (!auth) throw new UnauthorizedException('Authentication unavailable');
  return auth.fromToken(header.slice(7));
});
