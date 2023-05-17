import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtUserPayload } from 'src/common/types';

@Injectable()
export class JWTAuthService {
  constructor(private config: ConfigService, private readonly jwtService: JwtService) {}

  login(user: JwtUserPayload) {
    const roles: number[] = user.RolesOnUsers.map((r) => r.role_id);
    const payload = { email: user.email, roles, username: user.username, provider: user.provider };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken, payload };
  }
}
