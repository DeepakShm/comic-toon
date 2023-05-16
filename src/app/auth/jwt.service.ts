import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class JWTAuthService {
  constructor(private config: ConfigService, private readonly jwtService: JwtService) {}

  login(user: Partial<User>) {
    const payload = { email: user.email, role: user.role_id, username: user.username, provider: user.provider };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken, payload };
  }
}
