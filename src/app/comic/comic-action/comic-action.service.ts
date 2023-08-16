import { BadRequestException, ConflictException, Injectable, Scope } from '@nestjs/common';
import { PublisherService } from 'src/app/publisher/publisher.service';
import { RatingPayloadDTO } from 'src/common/dtos';
import { ReqUser } from 'src/common/types/JwtUserPayload';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable({ scope: Scope.REQUEST, durable: true })
export class ComicActionService {
  constructor(private readonly prisma: PrismaService, private readonly comicService: PublisherService) {}

  async setRatingToComic(ratePayload: RatingPayloadDTO, userDetails: ReqUser) {
    const { comic_id, rateCount: rate } = ratePayload;
    // check if comic exists
    const comicExists = await this.comicService.checkComicExistsUsingId(comic_id);
    if (!comicExists.ok) throw new ConflictException(comicExists.message);

    const { userId: user_id } = userDetails;
    // check the authenticated user rated the comic or not
    const userRated = await this.prisma.rating.findUnique({
      where: { user_id_comic_id: { comic_id, user_id } },
    });

    // number of users rated to the current comic
    const numberOfUserRated = await this.prisma.rating.count({
      where: { comic_id },
    });

    if (userRated) {
      // update the user with new rating value
      const rating = await this.prisma.rating.update({
        where: { user_id_comic_id: { comic_id, user_id } },
        data: { rate },
      });

      if (!rating) throw new BadRequestException('Something went wrong');
      // decrement the previous rating from total rating
      comicExists.data.totalRating = comicExists.data.totalRating * numberOfUserRated - userRated.rate;
    } else {
      // create user record
      const rating = await this.prisma.rating.create({
        data: { rate, comic_id, user_id },
      });

      if (!rating) throw new BadRequestException('Something went wrong');
    }

    // calculating new total rating
    const newTotalRating = numberOfUserRated > 0 ? (comicExists.data.totalRating + rate) / numberOfUserRated : 0;
    // updating the comic total rating
    const comic = await this.prisma.comic.update({
      where: { comicId: comic_id },
      data: { totalRating: { set: newTotalRating } },
    });

    return comic;
  }

  async subsToComic(comic_id: string, userDetails: ReqUser) {
    // check if comic exists
    const comicExists = await this.comicService.checkComicExistsUsingId(comic_id);
    if (!comicExists.ok) throw new ConflictException(comicExists.message);

    const { userId: user_id } = userDetails;
    // user subbed or not
    const subbedUser = await this.prisma.subscriber.findUnique({
      where: { user_id_comic_id: { comic_id, user_id } },
    });

    let subbed = 1;

    if (subbedUser) {
      await this.prisma.subscriber.delete({
        where: { user_id_comic_id: { comic_id, user_id } },
      });
      subbed = -1;
    } else {
      await this.prisma.subscriber.create({
        data: { comic_id, user_id },
      });
    }
    console.log(subbed);

    const comic = await this.prisma.comic.update({
      where: { comicId: comic_id },
      data: { totalSubs: { increment: subbed } },
    });

    return comic;
  }
}
