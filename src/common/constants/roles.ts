import { RoleMaster } from '@prisma/client';

export const ROLES: RoleMaster[] = [
  { id: 1, name: 'READER' },
  { id: 2, name: 'PUBLISHER' },
  { id: 3, name: 'SUPER_ADMIN' },
];

export enum ROLES_ENUM {
  READER = ROLES[0].id,
  PUBLISHER = ROLES[1].id,
  SUPER_ADMIN = ROLES[0].id,
}

export const ROLES_KEY = 'roles';

// TODO: Add the default picture url after image hosting setup
export const DEFAULT_PICTURE_URL = 'default/picture';
