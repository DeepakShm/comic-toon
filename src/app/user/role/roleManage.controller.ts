import {
  BadRequestException,
  ConflictException,
  Controller,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JWTGuard } from 'src/app/auth/utils/jwt.guard';
import { ROLES_ENUM } from 'src/common/constants/roles';
import { HasRoles } from 'src/common/decorators/has-roles.decorator';
import { RoleGuard } from 'src/common/guards/roles.guard';
import { ReqUser } from 'src/common/types/JwtUserPayload';
import { UserService } from '../user.service';
import { RoleManageService } from './roleManage.service';
import { isEmail } from '@nestjs/class-validator';

@Controller('role')
export class RoleManageController {
  constructor(private readonly userService: UserService, private readonly roleService: RoleManageService) {}

  @Post('assign')
  @HasRoles(ROLES_ENUM.READER)
  @UseGuards(JWTGuard, RoleGuard)
  async assignPublisherRole(@Query('email') email: string, @Req() req: Request) {
    if (!isEmail(email)) throw new BadRequestException(`'${email}' is not an Email.`);
    const user: Partial<ReqUser> = req.user;

    if (user?.roles.includes(ROLES_ENUM.READER) && user?.email !== email)
      throw new UnauthorizedException('You are not authorized to be a Publisher, Email does not match.');

    /**
     * TODO: check for Email varified or not
     */
    const userDetails = await this.userService.userDetailsUsingEmail(email);
    console.log(userDetails.RolesOnUsers);
    if (userDetails.RolesOnUsers.map((r) => r.role.id).includes(ROLES_ENUM.PUBLISHER))
      throw new ConflictException('Already a Publisher');

    if (await this.roleService.assignRole(ROLES_ENUM.PUBLISHER, email))
      return { ok: true, message: 'Role is assigned' };

    throw new BadRequestException('Something went wrong');
  }
}
