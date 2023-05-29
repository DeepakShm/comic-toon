import {
  BadRequestException,
  Body,
  Controller,
  ParseFilePipe,
  Post,
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
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { FileTypeCustomValidator } from 'src/common/validators/fileType.validator';
import { FileCustomValidator } from 'src/common/validators/fileCustom.validator';
import { CreateComicDTO } from './dto/creatComic.dto';

@Controller('test')
export class TestController {
  constructor(
    private readonly publisherService: PublisherService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @Post('/upload/comic')
  @HasRoles(ROLES_ENUM.PUBLISHER)
  @UseGuards(JWTGuard, RoleGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'sqaureThumbnail', maxCount: 1 },
        { name: 'horizontalThumnail', maxCount: 1 },
      ],
      { preservePath: true }
    )
  )
  uploadComic(
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
    files: { sqaureThumbnail: Express.Multer.File[]; horizontalThumnail: Express.Multer.File[] }
  ) {
    if (!(files?.horizontalThumnail && files?.sqaureThumbnail))
      throw new BadRequestException(`'Sqaure' and 'Horizontal' thumbnails are required`);
    // validating field one files
    const panelFileSizeValidator = new FileCustomValidator({
      size: { min: 10, max: 500 },
      dim: { width: 1000, height: 1000 },
      ratio: { h: 1, w: 1 },
      interceptorType: 'FILES',
    });
    if (!panelFileSizeValidator.isFilesValid(files.sqaureThumbnail)) panelFileSizeValidator.buildErrorMessage();

    const chapterFileSizeValidator = new FileCustomValidator({
      size: { min: 10, max: 500 },
      dim: { width: 1920, height: 1080 },
      ratio: { w: 16, h: 9 },
      interceptorType: 'FILES',
    });
    if (!chapterFileSizeValidator.isFilesValid(files.horizontalThumnail)) chapterFileSizeValidator.buildErrorMessage();

    console.log(comicData);

    return { comicData };
    // return this.cloudinaryService.uploadSingleFile(panel);
  }
}
