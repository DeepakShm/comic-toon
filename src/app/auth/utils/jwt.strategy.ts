import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AUTH_TOKEN } from 'src/common/constants/cookieConst';

@Injectable()
export class JWTstrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private config: ConfigService) {
    const tokenExtractor = (req: Request) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies[AUTH_TOKEN];
      }

      return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    };
    super({
      secretOrKey: config.get<string>('ACCESS_TOKEN_SECRET'),
      jwtFromRequest: tokenExtractor,
    });
  }

  async validate(payload: any) {
    return payload;
  }
}
