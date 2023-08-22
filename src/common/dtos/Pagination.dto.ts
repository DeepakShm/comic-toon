import { IsNumber, IsOptional, Max, Min } from '@nestjs/class-validator';
import { Transform } from 'class-transformer';

export class PaginationDTO {
  @Transform(({ value }) => +value)
  @Min(0)
  @IsNumber()
  @IsOptional()
  offset: number;

  @Transform(({ value }) => +value)
  @Max(100)
  @Min(15)
  @IsNumber()
  @IsOptional()
  limit: number;

  constructor() {
    this.limit = 15;
    this.offset = 0;
  }
}
