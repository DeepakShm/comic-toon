import { BadRequestException } from '@nestjs/common';
import { FileValidator } from '@nestjs/common/pipes/file';

import { imageSize as imageDim } from 'image-size';
import {
  AllFileValidatorType,
  FileFieldsValidatorType,
  FileValidatorType,
  FilesValidatorType,
} from '../types/fileValidator.type';

/**
 * size needs to be in Pixels
 */
type FileDimValidatorOptions = {
  height: number;
  width: number;
  interceptorType: 'FILE' | 'FILES' | 'FILE-FIELDS' | 'ANY-FILES';
};

/**
 * Validator for checking the multiple file size.
 */
export class FileDimValidator extends FileValidator<FileDimValidatorOptions> {
  protected validationOptions: FileDimValidatorOptions;
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
        const flattenFiles = Object.keys(files as FileFieldsValidatorType)
          .map((f) => files[f] as FileValidatorType)
          .flat(1);
        return this.isFilesValid(flattenFiles as FilesValidatorType);
    }
  }

  buildErrorMessage(): string {
    throw new BadRequestException(
      `Validation failed (expected file to be ${this.validationOptions.width} X ${this.validationOptions.height} px Dimensions)`
    );
  }

  isFileValid(file: FileValidatorType): boolean | Promise<boolean> {
    const { height, width } = imageDim(file.buffer);
    if (height !== this.validationOptions.height || width !== this.validationOptions.width) return false;
  }

  isFilesValid(files: FilesValidatorType) {
    for (let i = 0; i < files.length; i++) {
      const { height, width } = imageDim(files[i].buffer);
      if (height !== this.validationOptions.height || width !== this.validationOptions.width) return false;
    }
    return true;
  }
}
