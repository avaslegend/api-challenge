import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ValidatedUser } from './interface/validated-user.interface';
import { JwtPayload } from './interface/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.APP_JWT_SECRET ?? 'secretKey',
    });
  }

  validate(payload: JwtPayload): ValidatedUser {
    return { userId: payload.sub, username: payload.username };
  }
}