import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from '@nestjs/class-validator';
import { Transform } from 'class-transformer';
import { UploadApiResponse } from 'cloudinary';

export class CreateComicDTO {
  @IsNumber()
  @Transform((pg) => parseInt(pg.value))
  @IsNotEmpty()
  primaryGenre: number;

  @IsNumber()
  @Transform((sg) => parseInt(sg.value))
  @IsNotEmpty()
  secondaryGenre: number;

  @IsString()
  @IsNotEmpty()
  comic_name: string;

  @IsString()
  @IsNotEmpty()
  summary: string;

  @IsBoolean()
  @Transform((policy) => policy.value.toLowerCase() === 'true')
  @IsNotEmpty()
  policiesApproved: boolean;
}

export type ComicThumbnailsType = {
  sqaureThumbnail: Express.Multer.File[];
  horizontalThumbnail: Express.Multer.File[];
};
export type ComicThumbnailsMetadata = Record<keyof ComicThumbnailsType, UploadApiResponse>;

export class CreateChapterDTO {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  comic_id: string;

  @IsNumber()
  @Transform((sg) => parseInt(sg.value))
  @IsNotEmpty()
  chapter_number: number;

  @IsNotEmpty()
  chapter_name: string;

  @IsBoolean()
  @Transform((policy) => policy.value.toLowerCase() === 'true')
  @IsNotEmpty()
  verticalReadingMode: boolean;

  @IsString()
  @IsOptional()
  creator_note: string;
}

export type ChapterFilesType = {
  thumbnail: Express.Multer.File[];
  panels: Express.Multer.File[];
};
export type ChapterFilesTypeMetadata = {
  thumbnail: UploadApiResponse;
  panels: UploadApiResponse[];
};
