import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AUTH_TOKEN } from 'src/common/constants/cookieConst';
import { ReqUser } from 'src/common/types/JwtUserPayload';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JWTstrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private config: ConfigService, private prisma: PrismaService) {
    const tokenExtractor = (req: Request) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies[AUTH_TOKEN];
      }

      return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    };
    super({
      secretOrKey: config.getOrThrow<string>('ACCESS_TOKEN_SECRET'),
      jwtFromRequest: tokenExtractor,
    });
  }

  async validate(payload: ReqUser): Promise<ReqUser> {
    const userRoles = await this.prisma.user.findUnique({
      where: { email: payload.email },
      select: { RolesOnUsers: { select: { role_id: true } } },
    });
    return { ...payload, roles: userRoles.RolesOnUsers.map((r) => r.role_id) };
  }
}
