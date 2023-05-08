import { RoleMaster } from '@prisma/client';

export const ROLES: RoleMaster[] = [
  { id: 1, name: 'READER' },
  { id: 2, name: 'PUBLISHER' },
];
