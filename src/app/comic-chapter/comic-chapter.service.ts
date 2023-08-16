import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ComicChapterService {
  constructor(private readonly prisma: PrismaService) {}

  async chapterExistsUsingId(chapterId: string) {
    const chapter = await this.prisma.chapters.findUnique({
      where: { chapterId },
    });

    if (chapter) return { ok: true, message: 'Chapter Already exists', data: chapter };
    return { ok: false, message: 'Chapter does not exists', data: null };
  }

  async commentExistsUsingId(comment_id: string) {
    const comment = await this.prisma.comments.findUnique({
      where: { id: comment_id },
    });

    if (comment) return { ok: true, message: 'Comment Already exists', data: comment };
    return { ok: false, message: 'Comment does not exists', data: null };
  }
}
