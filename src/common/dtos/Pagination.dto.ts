import { IsNumber, IsOptional, Min } from '@nestjs/class-validator';
import { Transform } from 'class-transformer';

export class PaginationDTO {
  @Transform(({ value }) => +value)
  @Min(1)
  @IsNumber()
  @IsOptional()
  page: number;

  @Transform(({ value }) => +value)
  @Min(2)
  @IsNumber()
  @IsOptional()
  limit: number;
}
