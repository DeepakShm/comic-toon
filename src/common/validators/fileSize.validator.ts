import { BadRequestException } from '@nestjs/common';
import { FileValidator } from '@nestjs/common/pipes/file';
import {
  AllFileValidatorType,
  FileFieldsValidatorType,
  FileValidatorType,
  FilesValidatorType,
} from '../types/fileValidator.type';

/**
 * size needs to be in KB
 */
type FileSizeValidatorOptions = {
  minSize: number;
  maxSize: number;
  interceptorType: 'FILE' | 'FILES' | 'FILE-FIELDS' | 'ANY-FILES';
};

/**
 * Validator for checking the multiple file size.
 */
export class FileSizeValidator extends FileValidator<FileSizeValidatorOptions> {
  protected validationOptions: FileSizeValidatorOptions;
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
      `Validation failed (expected file to be between this range ${this.validationOptions.minSize} - ${this.validationOptions.maxSize} KB)`
    );
  }

  isFileValid(file: FileValidatorType): boolean | Promise<boolean> {
    const size = file.size / 1000;
    return size >= this.validationOptions.minSize && size <= this.validationOptions.maxSize;
  }

  isFilesValid(files: FilesValidatorType) {
    for (let i = 0; i < files.length; i++) {
      const size = files[i].size / 1000;
      if (size < this.validationOptions.minSize || size > this.validationOptions.maxSize) return false;
    }
    return true;
  }
}
