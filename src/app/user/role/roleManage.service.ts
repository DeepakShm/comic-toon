import { Injectable } from '@nestjs/common';
import { ROLES_ENUM } from 'src/common/constants/roles';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoleManageService {
  constructor(private readonly prisma: PrismaService) {}

  async assignRole(role: ROLES_ENUM, email: string) {
    const result = await this.prisma.user.update({
      where: { email: email },
      data: { RolesOnUsers: { create: [{ role: { connect: { id: role } } }] } },
    });

    return !!result;
  }

  async removeRole(role_id: ROLES_ENUM, email: string, user_id: string) {
    const result = await this.prisma.user.update({
      where: { email: email },
      data: { RolesOnUsers: { delete: [{ role_id_user_id: { role_id, user_id } }] } },
    });

    return !!result;
  }
}
