import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}
  async getHello() {
    const result = await this.prisma.comic.count();
    return { comicCount: result };
  }
}
