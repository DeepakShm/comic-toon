import { BadRequestException, Controller } from '@nestjs/common';
import { Body, Get, Post, Query, Req, UseGuards } from '@nestjs/common/decorators';
import { HasRoles } from 'src/common/decorators/has-roles.decorator';
import { ROLES_ENUM } from 'src/common/constants/roles';
import { JWTGuard } from '../auth/utils/jwt.guard';
import { RoleGuard } from 'src/common/guards/roles.guard';
import { ReqUser } from 'src/common/types/JwtUserPayload';
import { ComicActionService } from './comic-action/comic-action.service';
import { isUUID } from '@nestjs/class-validator';
import { RatingPayloadDTO } from 'src/common/dtos';
import { ComicService } from './comic.service';
import { QueryComicByGenre, QueryComicByStatus, QueryDailyComic, QueryTrendComic } from './dto/getComic.dto';

@Controller('comic')
export class ComicController {
  constructor(private readonly comicAction: ComicActionService, private readonly comicService: ComicService) {}

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

  @Get('by-genre')
  async fetchAllComicByGenre(@Query() query: QueryComicByGenre) {
    const comics = await this.comicService.getComicByGenre(query);
    return { ok: true, message: 'Done', data: comics };
  }

  @Get('by-status')
  async fetchAllComicByStatus(@Query() query: QueryComicByStatus) {
    const comics = await this.comicService.getComicByStatus(query);
    return { ok: true, message: 'Done', data: comics };
  }

  @Get('daily')
  async fetchAllDailyComic(@Query() query: QueryDailyComic) {
    console.log(query);
    const comics = await this.comicService.getDailyComic(query);
    return { ok: true, message: 'Done', data: comics };
  }

  @Get('trending')
  async fetchAllTrendingComic(@Query() query: QueryTrendComic) {
    console.log(query);
    const comics = await this.comicService.getTrendComic(query);
    return { ok: true, message: 'Done', data: comics };
  }
}
