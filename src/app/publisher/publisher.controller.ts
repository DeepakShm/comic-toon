import {
  BadRequestException,
  Body,
  Controller,
  ParseFilePipe,
  Post,
  Req,
  UnprocessableEntityException,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PublisherService } from './publisher.service';
import { HasRoles } from 'src/common/decorators/has-roles.decorator';
import { ROLES_ENUM } from 'src/common/constants/roles';
import { JWTGuard } from '../auth/utils/jwt.guard';
import { RoleGuard } from 'src/common/guards/roles.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ChapterFilesType, ComicThumbnailsType, CreateChapterDTO, CreateComicDTO } from './dto/creatComic.dto';
import { Request } from 'express';
import { ReqUser } from 'src/common/types/JwtUserPayload';
import { FileTypeCustomValidator } from 'src/common/validators/fileType.validator';
import { APIresponseType } from 'src/common/types/response.type';
import { ValidationService } from './validation.service';

@Controller('publisher')
export class PublisherController {
  constructor(
    private readonly publisherService: PublisherService,
    private readonly validationService: ValidationService
  ) {}

  // route handler for uploading comic thumbnail and data.
  @Post('/upload/comic')
  @HasRoles(ROLES_ENUM.PUBLISHER)
  @UseGuards(JWTGuard, RoleGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'sqaureThumbnail', maxCount: 1 },
      { name: 'horizontalThumbnail', maxCount: 1 },
    ])
  )
  async uploadComic(
    @Body() comicData: CreateComicDTO,
    @UploadedFiles(
      new ParseFilePipe({
        fileIsRequired: true,
        validators: [
          new FileTypeCustomValidator({ fileType: 'image/png|image/jpe?g', interceptorType: 'FILE-FIELDS' }),
        ],
        exceptionFactory: () => {
          throw new UnprocessableEntityException('Thumnails are required');
        },
      })
    )
    files: ComicThumbnailsType,
    @Req() req: Request
  ): Promise<APIresponseType> {
    // validating comic thumbnails
    if (!(files?.horizontalThumbnail && files?.sqaureThumbnail))
      throw new BadRequestException(`'Sqaure' and 'Horizontal' thumbnails are required`);

    this.validationService.validatingComicThumbnails(files);
    const userDetails = req.user as ReqUser;
    const comic = await this.publisherService.createComic(comicData, files, userDetails);

    return { ok: true, message: 'Comic created', data: { comic: comic } };
  }

  @Post('/upload/chapter')
  @HasRoles(ROLES_ENUM.PUBLISHER)
  @UseGuards(JWTGuard, RoleGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'panels', maxCount: 15 },
    ])
  )
  async uploadChapter(
    @Body() chapterDetails: CreateChapterDTO,
    @UploadedFiles(
      new ParseFilePipe({
        fileIsRequired: true,
        validators: [
          new FileTypeCustomValidator({ fileType: 'image/png|image/jpe?g', interceptorType: 'FILE-FIELDS' }),
        ],
        exceptionFactory: () => {
          throw new UnprocessableEntityException('Thumnails are required');
        },
      })
    )
    files: ChapterFilesType,
    @Req() req: Request
  ): Promise<APIresponseType> {
    // validating chapter image files
    if (!(files?.thumbnail && files?.panels)) throw new BadRequestException(`'Thumbnail' and 'Panels' are required`);
    this.validationService.validatingChapterFiles(files);

    const userDetails = req.user as ReqUser;

    // uploading and creating chapter
    const chapter = await this.publisherService.createChapter(chapterDetails, files, userDetails);

    return { ok: true, message: 'Comic created', data: { chapter } };
  }
}
