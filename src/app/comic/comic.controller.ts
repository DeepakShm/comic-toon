import { BadRequestException, Controller } from '@nestjs/common';
import { Body, Post, Query, Req, UseGuards } from '@nestjs/common/decorators';
import { HasRoles } from 'src/common/decorators/has-roles.decorator';
import { ROLES_ENUM } from 'src/common/constants/roles';
import { JWTGuard } from '../auth/utils/jwt.guard';
import { RoleGuard } from 'src/common/guards/roles.guard';
import { ReqUser } from 'src/common/types/JwtUserPayload';
import { ComicActionService } from './comic-action/comic-action.service';
import { isUUID } from '@nestjs/class-validator';
import { RatingPayloadDTO } from 'src/common/dtos';

@Controller('comic')
export class ComicController {
  constructor(private readonly comicAction: ComicActionService) {}

  @Post('rate')
  @HasRoles(ROLES_ENUM.READER)
  @UseGuards(JWTGuard, RoleGuard)
  async rateComic(@Body() ratingPayload: RatingPayloadDTO, @Req() req) {
    const userDetails = req?.user as ReqUser;

    await this.comicAction.setRatingToComic(ratingPayload, userDetails);
    return { ok: true, message: 'Done', data: null };
  }

  @Post('sub')
  @HasRoles(ROLES_ENUM.READER)
  @UseGuards(JWTGuard, RoleGuard)
  async subscribeComic(@Query('comic_id') comic_id: string, @Req() req) {
    if (!isUUID(comic_id)) throw new BadRequestException('Invalid Comic Id');
    const userDetails = req?.user as ReqUser;

    await this.comicAction.subsToComic(comic_id, userDetails);
    return { ok: true, message: 'Done', data: null };
  }
}
