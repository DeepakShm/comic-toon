import { Injectable } from '@nestjs/common';
import { FileCustomValidator, FileCustomValidatorOptions } from 'src/common/validators/fileCustom.validator';
import { ChapterFilesType, ComicThumbnailsType } from './dto/creatComic.dto';

@Injectable()
export class ValidationService {
  sqaureThumbnailValidatorOptions: FileCustomValidatorOptions = {
    size: { min: 10, max: 500 },
    dim: { width: 1000, height: 1000 },
    ratio: { h: 1, w: 1 },
    interceptorType: 'FILES',
  };

  horizontalThumbnailValidatorOptions: FileCustomValidatorOptions = {
    size: { min: 30, max: 700 },
    dim: { width: 1920, height: 1080 },
    ratio: { w: 16, h: 9 },
    interceptorType: 'FILES',
  };

  chapterThumbnailValidatorOptions: FileCustomValidatorOptions = {
    size: { min: 10, max: 500 },
    dim: { width: 500, height: 500 },
    ratio: { w: 1, h: 1 },
    interceptorType: 'FILES',
  };

  panelValidatorOptions: FileCustomValidatorOptions = {
    size: { min: 10, max: 2000 },
    dim: { width: 800, height: 1280 },
    ratio: { w: 5, h: 8 },
    interceptorType: 'FILES',
  };

  validatingComicThumbnails({ horizontalThumbnail, sqaureThumbnail }: ComicThumbnailsType) {
    const sqaureThumbnailValidator = new FileCustomValidator(this.sqaureThumbnailValidatorOptions);
    if (!sqaureThumbnailValidator.isFilesValid(sqaureThumbnail)) sqaureThumbnailValidator.buildErrorMessage();

    const horizontalThumnailValidator = new FileCustomValidator(this.horizontalThumbnailValidatorOptions);
    if (!horizontalThumnailValidator.isFilesValid(horizontalThumbnail)) horizontalThumnailValidator.buildErrorMessage();
  }

  validatingChapterFiles({ thumbnail, panels }: ChapterFilesType) {
    const chapterThumbnailValidator = new FileCustomValidator(this.chapterThumbnailValidatorOptions);
    if (!chapterThumbnailValidator.isFilesValid(thumbnail)) chapterThumbnailValidator.buildErrorMessage();

    const panelValidator = new FileCustomValidator(this.panelValidatorOptions);
    if (!panelValidator.isFilesValid(panels)) panelValidator.buildErrorMessage();
  }
}
