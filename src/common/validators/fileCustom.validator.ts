import { BadRequestException } from '@nestjs/common';
import { FileValidator } from '@nestjs/common/pipes/file';

import { imageSize as imageDim } from 'image-size';
import { AllFileValidatorType, FileValidatorType, FilesValidatorType } from '../types/fileValidator.type';

/**
 * size needs to be in Pixels
 */
type FileCustomValidatorOptions = {
  height: number;
  width: number;
  minSize: number;
  maxSize: number;
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
      `File Validation failed (expected file to be between this range ${this.validationOptions.minSize} - ${this.validationOptions.maxSize} KB and of ${this.validationOptions.width} X ${this.validationOptions.height} px Dimensions)`
    );
  }

  isFileValid(file: FileValidatorType): boolean | Promise<boolean> {
    const { height, width } = imageDim(file.buffer);
    if (height !== this.validationOptions.height || width !== this.validationOptions.width) return false;
    const size = file.size / 1000;
    return size >= this.validationOptions.minSize && size <= this.validationOptions.maxSize;
  }

  isFilesValid(files: FilesValidatorType) {
    for (let i = 0; i < files.length; i++) {
      const { height, width } = imageDim(files[i].buffer);
      if (height !== this.validationOptions.height || width !== this.validationOptions.width) return false;
      const size = files[i].size / 1000;
      if (size < this.validationOptions.minSize || size > this.validationOptions.maxSize) return false;
    }
    return true;
  }
}
