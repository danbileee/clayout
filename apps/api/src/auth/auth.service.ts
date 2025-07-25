import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EnvKeys } from 'src/shared/constants/env.const';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Tokens } from './interfaces/auth.interface';
import { UserRoles } from 'src/users/constants/role.const';
import { TokenType, TokenTypes } from './constants/token.const';

type TokenOptions = { tokenType: TokenType } & JwtSignOptions;

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  generateToken(
    user: Pick<UserEntity, 'email' | 'id'>,
    options?: TokenOptions,
  ) {
    const { tokenType, ...restOptions } = options ?? {};
    const payload = {
      email: user.email,
      sub: user.id,
      type: tokenType,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get(EnvKeys.JWT_SECRET),
      ...restOptions,
    });
  }

  generateTokens(user: Pick<UserEntity, 'email' | 'id'>): Tokens {
    return {
      accessToken: this.generateToken(user, {
        tokenType: TokenTypes.access,
        expiresIn: 300,
      }),
      refreshToken: this.generateToken(user, {
        tokenType: TokenTypes.refresh,
        expiresIn: 3600,
      }),
    };
  }

  decodeBasicToken(token: string): { email: string; password: string } {
    const decodedToken = Buffer.from(token, 'base64').toString('utf-8');
    const splitToken = decodedToken.split(':');

    if (splitToken.length !== 2) {
      throw new UnauthorizedException(`Invalid token`);
    }

    const [email, password] = splitToken;

    return {
      email,
      password,
    };
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get(EnvKeys.JWT_SECRET),
      });
    } catch (e) {
      throw new UnauthorizedException(`Token is invalid or expired`, {
        cause: e,
      });
    }
  }

  reissueToken(token: string, options?: TokenOptions) {
    const decodedToken = this.verifyToken(token);

    if (decodedToken.type !== 'refresh') {
      throw new UnauthorizedException(
        `Only refresh token is accepted to reissue the token.`,
      );
    }

    return this.generateToken(
      { email: decodedToken.email, id: decodedToken.sub },
      options,
    );
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
    user: Pick<UserEntity, 'username' | 'email' | 'password'>,
  ): Promise<boolean> {
    const hash = await bcrypt.hash(
      user.password,
      parseInt(this.configService.get(EnvKeys.HASH_ROUND)),
    );

    const createdUser = await this.usersService.createUser({
      ...user,
      password: hash,
      role: UserRoles.Registrant,
    });

    // TODO: createdUser로 컨펌 이메일 발송 트리거

    return true;
  }

  async confirm(token: string): Promise<Tokens> {
    const decodedToken = this.verifyToken(token);

    if (decodedToken.type !== 'confirm') {
      throw new UnauthorizedException(
        `Invalid token. Please check if this page is open from the email confirmation link.`,
      );
    }

    const matchedUser = await this.usersService.getUser({
      email: decodedToken.email,
    });

    if (!matchedUser) {
      throw new UnauthorizedException(`The user doesn't exist.`);
    }

    return this.generateTokens(matchedUser);
  }
}
