import { Controller, Post } from '@nestjs/common';
import { Body, Query, Req, UseGuards } from '@nestjs/common/decorators';
import { BadRequestException } from '@nestjs/common/exceptions';
import { isUUID } from '@nestjs/class-validator';
import { HasRoles } from 'src/common/decorators/has-roles.decorator';
import { ROLES_ENUM } from 'src/common/constants/roles';
import { JWTGuard } from '../auth/utils/jwt.guard';
import { RoleGuard } from 'src/common/guards/roles.guard';
import { ReqUser } from 'src/common/types/JwtUserPayload';
import { ChapterActionService } from './chapter-action/chapter-action.service';
import { CommentPayloadDTO } from 'src/common/dtos';

@Controller('chapter')
export class ComicChapterController {
  constructor(private readonly chapterAction: ChapterActionService) {}

  @Post('like')
  @HasRoles(ROLES_ENUM.READER)
  @UseGuards(JWTGuard, RoleGuard)
  async likingChapter(@Query('chapter_id') chapter_id: string, @Req() req) {
    if (!isUUID(chapter_id)) throw new BadRequestException('Invalid Chapter Id');
    const userDetails = req?.user as ReqUser;

    const result = await this.chapterAction.likeChapter(chapter_id, userDetails);
    return { ok: true, message: 'Done', data: result };
  }

  @Post('post/comment')
  @HasRoles(ROLES_ENUM.READER)
  @UseGuards(JWTGuard, RoleGuard)
  async commentingOnChapter(@Body() comment: CommentPayloadDTO, @Req() req) {
    const userDetails = req?.user as ReqUser;
    const result = await this.chapterAction.commentOnChapter(comment, userDetails);
    return { ok: true, message: 'Done', data: result };
  }

  @Post('like/comment')
  @HasRoles(ROLES_ENUM.READER)
  @UseGuards(JWTGuard, RoleGuard)
  async likingComment(@Query('comment_id') comment_id: string, @Req() req) {
    if (!isUUID(comment_id)) throw new BadRequestException('Invalid Comment Id');
    const userDetails = req?.user as ReqUser;

    const result = await this.chapterAction.likeComment(comment_id, userDetails);
    return { ok: true, message: 'Done', data: result };
  }
}
