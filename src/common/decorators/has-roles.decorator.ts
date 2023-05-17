import { SetMetadata } from '@nestjs/common';
import { ROLES_ENUM, ROLES_KEY } from '../constants/roles';

export const HasRoles = (...roles: ROLES_ENUM[]) => SetMetadata(ROLES_KEY, roles);
