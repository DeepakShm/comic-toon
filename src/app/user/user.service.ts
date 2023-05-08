import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async userExistsUsingEmail(email: string, provider: string) {
    const user: Partial<User> = await this.prisma.user.findUnique({
      where: { email: email },
      select: { provider: true, username: true, email: true, role_id: true },
    });
    if (user && user.provider === provider) return user;
    return false;
  }

  /**
   * username, email, provider, picture
   */
  async createUser(userDetails: Partial<User>) {
    const newUser = await this.prisma.user.create({
      data: {
        email: userDetails.email,
        password: userDetails.email,
        username: userDetails.username,
        provider: userDetails.provider,
        picture: userDetails.picture || 'default/picture',
        Role: { connect: { id: 1 } },
      },
      select: { provider: true, username: true, email: true, role_id: true },
    });

    return newUser;
  }
}
