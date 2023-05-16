import { RoleMaster } from '@prisma/client';

export const ROLES: RoleMaster[] = [
  { id: 1, name: 'READER' },
  { id: 2, name: 'PUBLISHER' },
  { id: 3, name: 'SUPER-ADMIN' },
];

// TODO: Add the default picture url after image hosting setup
export const DEFAULT_PICTURE_URL = 'default/picture';
