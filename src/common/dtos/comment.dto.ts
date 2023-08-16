import { IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from '@nestjs/class-validator';

export class CommentPayloadDTO {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  chapter_id: string;

  @MaxLength(1000)
  @MinLength(5)
  @IsString()
  @IsNotEmpty()
  message: string;
}
