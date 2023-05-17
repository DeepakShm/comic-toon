import { Body, Controller, Get, HttpException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JWTGuard } from '../auth/utils/jwt.guard';
import { HasRoles } from 'src/common/decorators/has-roles.decorator';
import { ROLES_ENUM } from 'src/common/constants/roles';
import { RoleGuard } from 'src/common/guards/roles.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //TODO: Temp route for testing.
  @Get('email')
  @HasRoles(ROLES_ENUM.READER)
  @UseGuards(JWTGuard, RoleGuard)
  async getUserDetailsUsingEmail(@Body() body: { email: string }) {
    if (!body.email) throw new HttpException('Email is empty', 404);
    return await this.userService.userDetailsUsingEmail(body.email);
  }
}
