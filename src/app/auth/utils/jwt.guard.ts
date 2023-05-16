import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AUTH_TOKEN } from 'src/common/constants/cookieConst';

@Injectable()
export class JWTGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context: ExecutionContext) {
    const response = context.switchToHttp().getResponse();
    try {
      if (err || !user || info) {
        throw err || info;
      }
      return user;
    } catch (error) {
      response.clearCookie(AUTH_TOKEN);
      throw new UnauthorizedException(error && error.message);
    }
  }
}
