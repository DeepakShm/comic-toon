import { BadRequestException } from '@nestjs/common';
import { FileValidator } from '@nestjs/common/pipes/file';

import { imageSize as imageDim } from 'image-size';
import { AllFileValidatorType, FileValidatorType, FilesValidatorType } from '../types/fileValidator.type';

/**
 * size needs to be in Pixels
 */
export type FileCustomValidatorOptions = {
  dim: {
    height: number;
    width: number;
  };
  ratio: {
    h: number;
    w: number;
  };
  size: {
    min: number;
    max: number;
  };
  interceptorType: 'FILE' | 'FILES';
};

/**
 * Validator for checking the multiple file size.
 */
export class FileCustomValidator extends FileValidator<FileCustomValidatorOptions> {
  protected validationOptions: FileCustomValidatorOptions;
  isValid(files: AllFileValidatorType): boolean | Promise<boolean> {
    if (!this.validationOptions) {
      return true;
    }

    switch (this.validationOptions.interceptorType) {
      case 'FILE':
        return this.isFileValid(files as FileValidatorType);
      case 'FILES':
        return this.isFilesValid(files as FilesValidatorType);
      default:
        return true;
    }
  }

  buildErrorMessage(): string {
    throw new BadRequestException(
      `File Validation failed (expected file to be between this range ${this.validationOptions.size.min} - ${this.validationOptions.size.max} KB and of ${this.validationOptions.dim.width} X ${this.validationOptions.dim.height} px Dimensions)`
    );
  }

  isFileValid(file: FileValidatorType): boolean | Promise<boolean> {
    const { height, width } = imageDim(file.buffer);
    // image dimension check
    if (height < this.validationOptions.dim.height || width < this.validationOptions.dim.width) return false;

    // image aspect ratio check
    if (height / this.validationOptions.ratio.h !== width / this.validationOptions.ratio.w) return false;

    // image size check
    const size = file.size / 1000;
    return size >= this.validationOptions.size.min && size <= this.validationOptions.size.max;
  }

  isFilesValid(files: FilesValidatorType) {
    for (let i = 0; i < files.length; i++) {
      const { height, width } = imageDim(files[i].buffer);

      // image dimension check
      if (height < this.validationOptions.dim.height || width < this.validationOptions.dim.width) return false;

      // image aspect ratio check
      if (height / this.validationOptions.ratio.h !== width / this.validationOptions.ratio.w) return false;

      // image size check
      const size = files[i].size / 1000;
      if (size < this.validationOptions.size.min || size > this.validationOptions.size.max) return false;
    }
    return true;
  }
}
