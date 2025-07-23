import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EnvKeys } from 'src/shared/constants/env.const';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Tokens } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  generateToken(user: Pick<UserEntity, 'email' | 'id'>, isRefreshing: boolean) {
    const payload = {
      email: user.email,
      sub: user.id,
      type: isRefreshing ? 'refresh' : 'access',
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get(EnvKeys.JWT_SECRET),
      expiresIn: isRefreshing ? 3600 : 300,
    });
  }

  generateTokens(user: Pick<UserEntity, 'email' | 'id'>): Tokens {
    return {
      accessToken: this.generateToken(user, false),
      refreshToken: this.generateToken(user, true),
    };
  }

  async authenticate(
    user: Pick<UserEntity, 'email' | 'password'>,
  ): Promise<UserEntity> {
    const matchedUser = await this.usersService.getUser({ email: user.email });

    if (!matchedUser) {
      throw new UnauthorizedException(`The user doesn't exist.`);
    }

    /**
     * @param
     * ### `bcrypt.compare(arg1, arg2)`
     * - arg1: password entered by the user
     * - arg2: existing hash from DB
     */
    const passed = await bcrypt.compare(user.password, matchedUser.password);

    if (!passed) {
      throw new UnauthorizedException(`Wrong password.`);
    }

    return matchedUser;
  }

  async login(user: Pick<UserEntity, 'email' | 'password'>): Promise<Tokens> {
    const matchedUser = await this.authenticate(user);

    return this.generateTokens(matchedUser);
  }

  async register(
    user: Pick<UserEntity, 'nickname' | 'email' | 'password'>,
  ): Promise<Tokens> {
    const hash = await bcrypt.hash(
      user.password,
      parseInt(this.configService.get(EnvKeys.HASH_ROUND)),
    );

    const createdUser = await this.usersService.createUser({
      ...user,
      password: hash,
    });

    return this.generateTokens(createdUser);
  }
}
