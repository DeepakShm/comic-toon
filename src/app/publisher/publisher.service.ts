import {
  HttpException,
  Injectable,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { CloudinaryService, MulterFileType } from '../cloudinary/cloudinary.service';
import {
  ChapterFilesType,
  ChapterFilesTypeMetadata,
  ComicThumbnailsMetadata,
  ComicThumbnailsType,
  CreateChapterDTO,
  CreateComicDTO,
} from './dto/creatComic.dto';
import { UploadApiResponse } from 'cloudinary';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReqUser } from 'src/common/types/JwtUserPayload';

@Injectable()
export class PublisherService {
  constructor(private readonly uploadService: CloudinaryService, private readonly prisma: PrismaService) {}

  async createComic(comicData: CreateComicDTO, comicThumbnail: ComicThumbnailsType, userDetails: ReqUser) {
    // check if comic already exists
    const exists = await this.checkComicExistsUsingName(comicData.comic_name);
    if (exists.ok) throw new ConflictException(exists.message);

    // 1. upload files and save the response.
    const thumbnailsMetadata: ComicThumbnailsMetadata = { sqaureThumbnail: null, horizontalThumbnail: null };
    thumbnailsMetadata.sqaureThumbnail = await this.uploadThumnails(comicThumbnail.sqaureThumbnail[0]);
    thumbnailsMetadata.horizontalThumbnail = await this.uploadThumnails(comicThumbnail.horizontalThumbnail[0]);

    // creating comic record in database.
    const slug = comicData.comic_name.toLowerCase().trim().replace(/\s+/g, '-');
    const result = await this.prisma.comic.create({
      data: {
        user_id: userDetails.userId,
        username: userDetails.username,
        comic_name: comicData.comic_name,
        summary: comicData.summary,
        status_id: 1,
        slug,
        policiesApproved: comicData.policiesApproved,
        primary_genre: comicData.primaryGenre,
        secondary_genre: comicData.secondaryGenre,
        square_thumbnail: thumbnailsMetadata.sqaureThumbnail.secure_url,
        horizontal_thumbnail: thumbnailsMetadata.horizontalThumbnail.secure_url,
        square_thumbnail_metadata: thumbnailsMetadata.sqaureThumbnail,
        horizontal_thumbnail_metadata: thumbnailsMetadata.horizontalThumbnail,
      },
    });

    if (result === null) throw new BadRequestException('Something went wrong');
    return result;
  }

  private async uploadThumnails(file: MulterFileType) {
    try {
      return (await this.uploadService.uploadSingleFile(file)) as UploadApiResponse;
    } catch (error) {
      if (error.http_code) throw new HttpException({ message: error.message, name: error.name }, error.http_code);
      throw new BadRequestException();
    }
  }

  async createChapter(chapterData: CreateChapterDTO, files: ChapterFilesType, userDetails: ReqUser) {
    // check for comic exists
    const exists = await this.checkComicExistsUsingId(chapterData.comic_id);
    if (!exists.ok) throw new ConflictException(exists.message);
    // checking if same user is posting the chapter who created the comic
    if (exists.data.user_id !== userDetails.userId)
      throw new UnauthorizedException('You cannot post a chapter to this comic');

    // uploading files of chapter
    const chapterFiles: ChapterFilesTypeMetadata = { panels: [], thumbnail: null };
    chapterFiles.thumbnail = await this.uploadThumnails(files.thumbnail[0]);

    for (const p of files.panels) {
      const metadata = await this.uploadThumnails(p);
      console.log({ metadata });
      chapterFiles.panels.push(metadata);
    }

    const lastChapterNumber = await this.getLastChapterNumber();

    const chapter = await this.prisma.chapters.create({
      data: {
        user_id: userDetails.userId,
        comic_id: chapterData.comic_id,
        chapter_name: chapterData.chapter_name,
        chapter_number: lastChapterNumber,
        verticalReadingMode: chapterData.verticalReadingMode,
        creator_note: chapterData.creator_note,
        thumbnail: chapterFiles.thumbnail.secure_url,
        thumbnail_metadata: chapterFiles.thumbnail,
        Panels: {
          createMany: {
            data: chapterFiles.panels.map((p) => {
              return { panel_metadata: p, panelUrl: p.secure_url };
            }),
          },
        },
      },
      include: { Panels: { select: { panel_metadata: true } } },
    });

    if (chapter === null) throw new BadRequestException('Something went wrong');
    return chapter;
  }

  async getLastChapterNumber() {
    const lastChapterNumber =
      (await this.prisma.chapters.aggregate({ _max: { chapter_number: true } }))._max.chapter_number || 0;
    return lastChapterNumber + 1;
  }

  async checkComicExistsUsingName(comic_name: string) {
    const comic = await this.prisma.comic.findUnique({
      where: { comic_name },
    });

    if (comic) return { ok: true, message: `Comic Already exists with '${comic_name}' this name.` };
    return { ok: false, message: 'Comic does not exists' };
  }

  async checkComicExistsUsingId(comic_id: string) {
    const comic = await this.prisma.comic.findUnique({
      where: { comicId: comic_id },
    });

    if (comic) return { ok: true, message: 'Comic Already exists', data: comic };
    return { ok: false, message: 'Comic does not exists', data: null };
  }
}
