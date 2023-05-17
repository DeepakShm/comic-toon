import { Body, ConflictException, Controller, Get, NotFoundException, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { GoogleAuthGuard } from './utils/google.guard';
import { JWTAuthService } from './jwt.service';
import { CreateUserDTO, SignInDTO } from './dto/signup.dto';
import { UserService } from '../user/user.service';
import { APIresponseType } from 'src/common/types/response.type';
import { JwtUserPayload } from 'src/common/types';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JWTAuthService,
    private readonly userService: UserService
  ) {}

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleGoogleLogin() {
    return { msg: 'Google Authentication' };
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  handleGoogleRedirect(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { accessToken } = this.jwtService.login(req.user as JwtUserPayload);
    console.log(req.user);
    this.authService.setAuthTokenCookie(res, accessToken);
    return res.redirect('https://github.com/DeepakShm');
  }

  @Post('local/signup')
  async handleLocalSignup(@Body() createUserDetails: CreateUserDTO, @Res({ passthrough: true }) res: Response) {
    const userExists = (await this.userService.userExistsUsingEmail(
      createUserDetails.email,
      createUserDetails.username,
      'local'
    )) as boolean;
    if (userExists) throw new ConflictException('User Already Exists. Try again with different email or username');

    // user does not exists, creating a new user
    const newUser = await this.userService.createUser({ provider: 'local', ...createUserDetails });

    // now login the user with newUser details
    const { accessToken } = this.jwtService.login(newUser);
    this.authService.setAuthTokenCookie(res, accessToken);
    console.log('Token Generated');

    // might add user details in response in future.
    return { ok: true, message: 'User successfully created' };
  }

  @Post('local/signin')
  async handleLocalSignin(
    @Body() userDetails: SignInDTO,
    @Res({ passthrough: true }) res: Response
  ): Promise<APIresponseType> {
    const userExists = await this.userService.userExistsUsingEmailPassword(
      userDetails.email,
      userDetails.password,
      'local'
    );
    if (!userExists.ok) {
      throw new NotFoundException(userExists.message);
    }

    const { accessToken } = this.jwtService.login(userExists.user);
    this.authService.setAuthTokenCookie(res, accessToken);

    return { ok: true, message: userExists.message };
  }

  @Post('/logout')
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): APIresponseType {
    // req.logOut({ keepSessionInfo: false }, (error: any) => {
    //   throw new ServiceUnavailableException({ error });
    // });

    this.authService.clearCookies(res);

    return { ok: true, message: 'Logout Successfull' };
  }
}
