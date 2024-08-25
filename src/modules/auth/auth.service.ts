import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async validatePassword(
    payloadPassword: string,
    user: UserEntity,
  ): Promise<boolean> {
    const hashPassword = user?.password ?? '';
    return bcrypt.compare(payloadPassword, hashPassword);
  }

  async login(user: UserEntity): Promise<{ accessToken: string }> {
    const payload = { username: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
