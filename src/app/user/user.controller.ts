import { Body, Controller, Get, HttpException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JWTGuard } from '../auth/utils/jwt.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //TODO: Temp route for testing.
  @Get('email')
  @UseGuards(JWTGuard)
  async getUserDetailsUsingEmail(@Body() body: { email: string }) {
    if (!body.email) throw new HttpException('Email is empty', 404);
    return await this.userService.userDetailsUsingEmail(body.email);
  }
}
