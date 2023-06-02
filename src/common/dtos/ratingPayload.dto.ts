import { IsNotEmpty, IsNumber, IsString, IsUUID, Max, Min } from '@nestjs/class-validator';
import { Transform } from 'class-transformer';

export class RatingPayloadDTO {
  @Transform((rating) => {
    const num = rating.value as number;
    return parseFloat(num.toFixed(1));
  })
  @Max(5)
  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  rateCount: number;

  @IsUUID()
  @IsString()
  @IsNotEmpty()
  comic_id: string;
}
