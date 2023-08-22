import { Prisma } from '@prisma/client';

export const ComicSortBy = {
  POPULARITY: Prisma.validator<Prisma.ComicOrderByWithRelationInput[]>()([
    { totalRating: 'desc' },
    { totalSubs: 'desc' },
    { shareCount: 'desc' },
    { downloadCount: 'desc' },
  ]),
  RATING: Prisma.validator<Prisma.ComicOrderByWithRelationInput>()({
    totalRating: 'desc',
  }),
  DATE: Prisma.validator<Prisma.ComicOrderByWithRelationInput>()({
    lastChapterUpdatedAt: 'desc',
  }),
};
