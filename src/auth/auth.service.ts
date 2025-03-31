import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { User } from './interface/user.interface';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  private readonly demoUser: User & { password: string } = {
    username: process.env.APP_USER ?? '',
    password: process.env.APP_PASSWORD ?? '',
    userId: '1',
  };

  validateUser(username: string, password: string): User | null {
    if (username === this.demoUser.username && password === this.demoUser.password) {
      return { username: this.demoUser.username, userId: this.demoUser.userId };
    }
    return null;
  }

  login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user = this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
