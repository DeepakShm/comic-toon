import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { GoogleAuthGuard } from './utils/google.guard';
import { JWTAuthService } from './jwt.service';
import { AUTH_TOKEN } from 'src/common/constants/cookieConst';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly jwtService: JWTAuthService) {}

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleGoogleLogin() {
    return { msg: 'Google Authentication' };
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  handleGoogleRedirect(@Req() req: Request, @Res() res: Response) {
    const { accessToken } = this.jwtService.login(req.user);
    console.log({ accessToken });
    res.cookie(AUTH_TOKEN, accessToken, {
      httpOnly: true,
      sameSite: 'lax',
    });
    return res.redirect('https://github.com/DeepakShm');
  }
}
