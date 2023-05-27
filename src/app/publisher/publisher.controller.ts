import { Body, Controller, ParseFilePipe, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { PublisherService } from './publisher.service';
import { HasRoles } from 'src/common/decorators/has-roles.decorator';
import { ROLES_ENUM } from 'src/common/constants/roles';
import { JWTGuard } from '../auth/utils/jwt.guard';
import { RoleGuard } from 'src/common/guards/roles.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { FileTypeCustomValidator } from 'src/common/validators/fileType.validator';
import { FileCustomValidator } from 'src/common/validators/fileCustom.validator';

@Controller('publisher')
export class PublisherController {
  constructor(
    private readonly publisherService: PublisherService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @Post('/upload/single')
  @HasRoles(ROLES_ENUM.PUBLISHER)
  @UseGuards(JWTGuard, RoleGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'panels', maxCount: 1 },
      { name: 'chapters', maxCount: 3 },
    ])
  )
  uploadSingleFile(
    @Body() formData,
    @UploadedFiles(
      new ParseFilePipe({
        fileIsRequired: true,
        validators: [
          new FileTypeCustomValidator({ fileType: 'image/png|image/jpe?g', interceptorType: 'FILE-FIELDS' }),
        ],
      })
    )
    files: { panels: Express.Multer.File[]; chapters: Express.Multer.File[] }
  ) {
    // validating field one files
    const panelFileSizeValidator = new FileCustomValidator({
      minSize: 10,
      maxSize: 500,
      height: 1000,
      width: 1000,
      interceptorType: 'FILES',
    });
    if (!panelFileSizeValidator.isFilesValid(files.panels)) panelFileSizeValidator.buildErrorMessage();

    const chapterFileSizeValidator = new FileCustomValidator({
      minSize: 10,
      maxSize: 2000,
      height: 1080,
      width: 1920,
      interceptorType: 'FILES',
    });
    if (!chapterFileSizeValidator.isFilesValid(files.chapters)) chapterFileSizeValidator.buildErrorMessage();

    return { formData };
    // return this.cloudinaryService.uploadSingleFile(panel);
  }
}
