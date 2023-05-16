import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { AUTH_TOKEN, ROLE } from 'src/common/constants/cookieConst';

@Injectable()
export class AuthService {
  setAuthTokenCookie(res: Response, accessToken: string) {
    res.cookie(AUTH_TOKEN, accessToken, {
      httpOnly: true,
      sameSite: 'lax',
    });
  }

  setRoleCookie(res: Response, role_id: number) {
    res.cookie(ROLE, role_id, {
      httpOnly: true,
      sameSite: 'lax',
    });
  }

  clearCookies(res: Response) {
    res.clearCookie(AUTH_TOKEN, { maxAge: 0 });
  }
}
