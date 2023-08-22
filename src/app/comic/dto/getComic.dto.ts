import { IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from '@nestjs/class-validator';
import { Transform } from 'class-transformer';
import { ComicSortBy } from 'src/common/constants/comicSortCategory.const';
import { COMIC_STATUS, GENRE } from 'src/common/constants/genre';
import { PaginationDTO } from 'src/common/dtos';

export const WeekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export class QueryComicByGenre extends PaginationDTO {
  @IsInt()
  @Transform((genre) => {
    const genreType = String(genre.value).toUpperCase();
    const id = GENRE.find((g) => g.genreName === genreType)?.genreId;
    return id !== undefined ? id : 1;
  })
  @IsNotEmpty()
  type: number;

  @IsIn(Object.keys(ComicSortBy))
  @Transform((type) => type.value.toUpperCase())
  @IsString()
  @IsNotEmpty()
  sortby: string;

  @IsInt()
  @Transform((status) => {
    const statusType = String(status.value).toUpperCase();
    const id = COMIC_STATUS.find((g) => g.name === statusType)?.id;
    return id !== undefined ? id : 2;
  })
  @IsNotEmpty()
  status: number;

  constructor() {
    super();
    this.type = 1;
    this.sortby = 'POPULARITY';
    this.status = 2;
  }
}

export class QueryComicByStatus extends PaginationDTO {
  @IsInt()
  @Transform((status) => {
    const statusType = String(status.value).toUpperCase();
    const id = COMIC_STATUS.find((g) => g.name === statusType)?.id;
    return id !== undefined ? id : 2;
  })
  @IsNotEmpty()
  type: number;

  constructor() {
    super();
    this.type = 2;
  }
}

export class QueryDailyComic extends PaginationDTO {
  @IsIn(WeekDays)
  @Transform((day) => typeof day.value == 'string' && day.value.toLowerCase())
  @IsString()
  @IsOptional()
  weekday: string;

  constructor() {
    super();
    this.weekday = WeekDays[new Date().getDay()];
  }
}

export class QueryTrendComic {
  @Transform(({ value }) => +value)
  @Max(100)
  @Min(15)
  @IsNumber()
  @IsOptional()
  limit: number;

  constructor() {
    this.limit = 10;
  }
}
