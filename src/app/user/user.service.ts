import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { DEFAULT_PICTURE_URL } from 'src/common/constants/roles';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async userExistsUsingEmail(email: string, username: string, provider: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
      select: { provider: true, username: true, email: true, RolesOnUsers: { select: { role_id: true } } },
    });
    if (user && user.provider === provider) return user;
    return false;
  }

  /**
   * username, email, provider, picture
   */
  async createUser(userDetails: Partial<User>) {
    const password = userDetails.provider === 'local' ? userDetails.password : userDetails.email;
    const newUser = await this.prisma.user.create({
      data: {
        email: userDetails.email,
        password: await this.hashPassword(password),
        username: userDetails.username,
        provider: userDetails.provider,
        picture: userDetails.picture || DEFAULT_PICTURE_URL,
        RolesOnUsers: { create: [{ role: { connect: { id: 1 } } }] },
      },
      select: { provider: true, username: true, email: true, RolesOnUsers: { select: { role_id: true } } },
    });

    return newUser;
  }

  async userExistsUsingEmailPassword(email: string, password: string, provider: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
      select: {
        provider: true,
        username: true,
        email: true,
        RolesOnUsers: { select: { role_id: true } },
        password: true,
      },
    });

    if (!user) return { ok: false, message: 'User does not exists', user: null };
    if (user.provider !== provider) return { ok: false, message: 'User does not exists', user: null };

    if (!(await this.hashCompare(password, user.password)))
      return { ok: false, message: 'Invalid password', user: null };
    return { ok: true, message: 'Success', user };
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(15);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  async hashCompare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async userDetailsUsingEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        nickname: true,
        email: true,
        provider: true,
        RolesOnUsers: { select: { role: { select: { name: true } } } },
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
