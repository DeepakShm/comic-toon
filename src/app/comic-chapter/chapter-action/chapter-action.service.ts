import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { ReqUser } from 'src/common/types/JwtUserPayload';
import { PrismaService } from 'src/prisma/prisma.service';
import { ComicChapterService } from '../comic-chapter.service';
import { LIKE_OBJECT_TYPE } from 'src/common/constants/chapter.const';
import { CommentPayloadDTO } from 'src/common/dtos';

@Injectable()
export class ChapterActionService {
  constructor(private readonly prisma: PrismaService, private readonly chapterService: ComicChapterService) {}

  async likeChapter(chapter_id: string, userDetails: ReqUser) {
    const chapterDeatils = await this.chapterService.chapterExistsUsingId(chapter_id);
    if (!chapterDeatils.ok) throw new ConflictException(chapterDeatils.message);

    const { userId: user_id } = userDetails;

    const userLiked = await this.prisma.likes.findUnique({
      where: { object_id_user_id: { object_id: chapter_id, user_id } },
    });

    const liked = await this.updateLikeTable(chapter_id, user_id, !!userLiked, LIKE_OBJECT_TYPE.CHAPTER);

    const result = await this.prisma.chapters.update({
      where: { chapterId: chapter_id },
      data: { like_count: { increment: liked ? 1 : -1 } },
    });

    return result;
  }

  async updateLikeTable(
    object_id: string,
    user_id: string,
    like_status: boolean,
    object_type: LIKE_OBJECT_TYPE
  ): Promise<boolean> {
    if (like_status) {
      // dislike function
      await this.prisma.likes.delete({
        where: { object_id_user_id: { object_id, user_id } },
      });
      return false;
    }
    // like function
    await this.prisma.likes.create({
      data: { object_id, object_type: object_type, user_id },
    });
    return true;
  }

  async commentOnChapter(comment: CommentPayloadDTO, userDetails: ReqUser) {
    const chapterDeatils = await this.chapterService.chapterExistsUsingId(comment.chapter_id);
    if (!chapterDeatils.ok) throw new ConflictException(chapterDeatils.message);

    const { userId: user_id, username } = userDetails;

    const result = await this.prisma.comments.create({
      data: { message: comment.message, chapter_id: comment.chapter_id, username, user_id },
    });

    if (!result) throw new BadRequestException('Something went wrong');
    return result;
  }

  async likeComment(comment_id: string, userDetails: ReqUser) {
    const commentDetails = await this.chapterService.commentExistsUsingId(comment_id);
    if (!commentDetails.ok) throw new ConflictException(commentDetails.message);

    const { userId: user_id } = userDetails;

    const userLiked = await this.prisma.likes.findUnique({
      where: { object_id_user_id: { object_id: comment_id, user_id } },
    });

    const liked = await this.updateLikeTable(comment_id, user_id, !!userLiked, LIKE_OBJECT_TYPE.COMMENT);

    const result = await this.prisma.comments.update({
      where: { id: comment_id },
      data: { like_count: { increment: liked ? 1 : -1 } },
    });

    if (!result) throw new BadRequestException('Something went wrong');
    return result;
  }
}
