export type FileValidatorType = Express.Multer.File;
export type FilesValidatorType = Express.Multer.File[];
export type FileFieldsValidatorType = Record<string, Express.Multer.File[]>;
export type AnyFileValidatorType = Record<string, Express.Multer.File[]>;

export type AllFileValidatorType =
  | FileFieldsValidatorType
  | FileValidatorType
  | FilesValidatorType
  | AnyFileValidatorType;
