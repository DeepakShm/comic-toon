import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryComicByGenre, QueryComicByStatus, QueryDailyComic, QueryTrendComic } from './dto/getComic.dto';
import { ComicSortBy } from 'src/common/constants/comicSortCategory.const';
import { PaginationResponse } from 'src/common/types/response.type';

@Injectable()
export class ComicService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllComic() {
    return await this.prisma.comic.findMany({ include: { _count: { select: { Chapters: true } } } });
  }

  async getComicByGenre(query: QueryComicByGenre) {
    const { limit, offset, sortby, status, type: genre } = query;
    const { skip, take } = { skip: offset * limit, take: limit };
    const comics = await this.prisma.comic.findMany({
      skip,
      take,
      where: {
        AND: [
          {
            status_id: { equals: status },
            deleted: false,
            OR: [{ primary_genre: { equals: genre } }, { secondary_genre: { equals: genre } }],
          },
        ],
      },
      orderBy: ComicSortBy[sortby],
      include: {
        _count: { select: { Chapters: true } },
      },
    });

    const res = this.getPaginationResponse(comics.length, limit, offset);
    return { comics, ...res };
  }

  async getComicByStatus(query: QueryComicByStatus) {
    const { limit, offset, type: status } = query;
    const { skip, take } = { skip: offset * limit, take: limit };
    const comics = await this.prisma.comic.findMany({
      skip,
      take,
      where: {
        AND: [
          {
            status_id: { equals: status },
            deleted: false,
          },
        ],
      },
      orderBy: ComicSortBy['DATE'],
      include: {
        _count: { select: { Chapters: true } },
      },
    });

    const res = this.getPaginationResponse(comics.length, limit, offset);
    return { comics, ...res };
  }

  async getDailyComic(query: QueryDailyComic) {
    const { limit, offset, weekday: day } = query;
    const { skip, take } = { skip: offset * limit, take: limit };

    const comics = await this.prisma.comic.findMany({
      skip,
      take,
      where: {
        AND: [
          {
            status_id: { equals: 2 },
            deleted: false,
            weekday: { equals: day, contains: day },
          },
        ],
      },
      orderBy: ComicSortBy['DATE'],
      include: {
        _count: { select: { Chapters: true } },
      },
    });

    const res = this.getPaginationResponse(comics.length, limit, offset);
    return { comics, ...res };
  }

  async getTrendComic(query: QueryTrendComic) {
    const comics = await this.prisma.comic.findMany({
      take: query.limit,
      where: {
        AND: [
          {
            status_id: { equals: 2 },
            deleted: false,
          },
        ],
      },
      orderBy: { ...ComicSortBy['POPULARITY'], ...ComicSortBy['DATE'] },
      include: {
        _count: { select: { Chapters: true } },
      },
    });

    return { comics };
  }

  getPaginationResponse(count: number, limit: number, offset: number) {
    const res: PaginationResponse = {
      limit,
      count,
      current_offset: offset,
      next_offset: count > 0 ? offset + 1 : null,
    };
    return res;
  }
}
