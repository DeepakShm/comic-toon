import { GenreMaster, StatusMaster } from '@prisma/client';

export const GENRE: GenreMaster[] = [
  { genreName: 'DRAMA', genreId: 1 },
  { genreName: 'FANTASY', genreId: 2 },
  { genreName: 'COMEDY', genreId: 3 },
  { genreName: 'ACTION', genreId: 4 },
  { genreName: 'SLICE OF LIFE', genreId: 5 },
  { genreName: 'ROMANCE', genreId: 6 },
  { genreName: 'SUPERHERO', genreId: 7 },
  { genreName: 'SCI-FI', genreId: 8 },
  { genreName: 'THRILLER', genreId: 9 },
  { genreName: 'SUPERNATURAL', genreId: 10 },
  { genreName: 'OTHERS', genreId: 11 },
];

export const COMIC_STATUS: StatusMaster[] = [
  { id: 1, name: 'DRAFT' },
  { id: 2, name: 'ONGOING' },
  { id: 3, name: 'PAUSE' },
  { id: 4, name: 'COMPLETED' },
];
