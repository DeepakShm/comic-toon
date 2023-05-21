import { Response } from 'express';
import { AUTH_TOKEN, ROLE } from 'src/common/constants/cookieConst';

function setAuthTokenCookie(res: Response, accessToken: string) {
  res.cookie(AUTH_TOKEN, accessToken, {
    httpOnly: true,
    sameSite: 'lax',
  });
}

function setRoleCookie(res: Response, role_id: number) {
  res.cookie(ROLE, role_id, {
    httpOnly: true,
    sameSite: 'lax',
  });
}

function clearCookies(res: Response) {
  res.clearCookie(AUTH_TOKEN, { maxAge: 0 });
}

export { clearCookies, setAuthTokenCookie, setRoleCookie };
