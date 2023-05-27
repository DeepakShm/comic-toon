import { BadRequestException } from '@nestjs/common';
import { FileValidator } from '@nestjs/common/pipes/file';
import {
  AllFileValidatorType,
  FileFieldsValidatorType,
  FileValidatorType,
  FilesValidatorType,
} from '../types/fileValidator.type';

/**
 * size needs to be in Pixels
 */
type FileTypeCustomValidatorOptions = {
  fileType: string | RegExp;
  interceptorType: 'FILE' | 'FILES' | 'FILE-FIELDS' | 'ANY-FILES';
};

/**
 * Validator for checking the multiple file size.
 */
export class FileTypeCustomValidator extends FileValidator<FileTypeCustomValidatorOptions> {
  protected validationOptions: FileTypeCustomValidatorOptions;
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
      `Validation failed (unexpected file type, file should be of type : ${this.validationOptions.fileType})`
    );
  }

  isFileValid(file: FileValidatorType): boolean | Promise<boolean> {
    return Boolean(file.mimetype.match(this.validationOptions.fileType));
  }

  isFilesValid(files: FilesValidatorType) {
    for (let i = 0; i < files.length; i++) {
      if (!Boolean(files[i].mimetype.match(this.validationOptions.fileType))) return false;
    }
    return true;
  }
}
