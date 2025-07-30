import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as qs from 'qs';
import { EnvKeys } from 'src/shared/constants/env.const';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Tokens } from './interfaces/auth.interface';
import { UserRoles } from 'src/users/constants/role.const';
import { TokenType, TokenTypes } from './constants/token.const';
import { EmailsService } from 'src/emails/emails.service';
import { Request } from 'express';

type TokenOptions = { tokenType: TokenType } & JwtSignOptions;

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly emailsService: EmailsService,
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

  async getUser(req: Request): Promise<UserEntity> {
    const accessToken = req.cookies['accessToken'];
    const basicToken = req.cookies['basicToken'];

    // If accessToken exists, use it (for confirmed users)
    if (accessToken) {
      const decodedToken = this.verifyToken(accessToken);

      if (decodedToken.type !== TokenTypes.access) {
        throw new UnauthorizedException(`Invalid token type.`);
      }

      const matchedUser = await this.usersService.getUser({
        email: decodedToken.email,
      });

      if (!matchedUser) {
        throw new UnauthorizedException(`The user doesn't exist.`);
      }

      return matchedUser;
    }

    // If no accessToken but basicToken exists, use it (for unconfirmed users)
    if (basicToken) {
      const decodedToken = this.verifyToken(basicToken);

      if (decodedToken.type !== TokenTypes.basic) {
        throw new UnauthorizedException(`Invalid token type.`);
      }

      const matchedUser = await this.usersService.getUser({
        email: decodedToken.email,
      });

      if (!matchedUser) {
        throw new UnauthorizedException(`The user doesn't exist.`);
      }

      return matchedUser;
    }

    throw new UnauthorizedException(`Token not found.`);
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
  ): Promise<{ basicToken: string }> {
    const hash = await bcrypt.hash(
      user.password,
      parseInt(this.configService.get(EnvKeys.HASH_ROUND), 10),
    );

    const createdUser = await this.usersService.createUser({
      ...user,
      password: hash,
      role: UserRoles.Registrant,
    });
    const createdEmail = await this.emailsService.createEmail({
      user: createdUser,
      to: createdUser.email,
      subject: `Verify your account`,
      template: 'verify-email',
    });

    const openLink = `${this.configService.get(EnvKeys.API_HOST)}/emails/${createdEmail.id}/track-open`;
    const basicToken = this.generateToken(createdUser, {
      tokenType: TokenTypes.basic,
      expiresIn: 3600,
    });
    const queryString = qs.stringify(
      {
        token: basicToken,
        email_id: createdEmail.id,
        button_text: `Verify email`,
      },
      { addQueryPrefix: true },
    );
    const ctaLink = `${this.configService.get(EnvKeys.WEB_HOST)}/auth/confirm${queryString}`;

    await this.emailsService.sendEmail({
      ...createdEmail,
      context: {
        name: createdUser.username,
        openLink,
        ctaLink,
      },
    });

    return { basicToken };
  }

  async confirm(token: string): Promise<Tokens> {
    const decodedToken = this.verifyToken(token);

    if (decodedToken.type !== TokenTypes.basic) {
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

    const updatedUser: UserEntity = {
      ...matchedUser,
      role: UserRoles.User,
    };

    await this.usersService.updateUser(updatedUser);

    return this.generateTokens(updatedUser);
  }

  async forgotPassword({ email }: Pick<UserEntity, 'email'>) {
    const matchedUser = await this.usersService.getUser({ email });

    if (!matchedUser) {
      throw new UnauthorizedException(`The user doesn't exist.`);
    }

    const createdEmail = await this.emailsService.createEmail({
      user: matchedUser,
      to: matchedUser.email,
      subject: `Reset your password`,
      template: 'reset-password',
    });

    const openLink = `${this.configService.get(EnvKeys.API_HOST)}/emails/${createdEmail.id}/track-open`;
    const basicToken = this.generateToken(matchedUser, {
      tokenType: TokenTypes.basic,
      expiresIn: 900,
    });
    const queryString = qs.stringify(
      {
        token: basicToken,
        email_id: createdEmail.id,
        button_text: `Reset password`,
      },
      { addQueryPrefix: true },
    );
    const ctaLink = `${this.configService.get(EnvKeys.WEB_HOST)}/reset-password${queryString}`;

    await this.emailsService.sendEmail({
      ...createdEmail,
      context: {
        name: matchedUser.username,
        openLink,
        ctaLink,
      },
    });

    return { basicToken };
  }

  async resetPassword(token: string, user: UserEntity, newPassword: string) {
    const decodedToken = this.verifyToken(token);

    if (decodedToken.type !== TokenTypes.basic) {
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

    const hash = await bcrypt.hash(
      newPassword,
      parseInt(this.configService.get(EnvKeys.HASH_ROUND), 10),
    );

    const updatedUser = await this.usersService.updateUser({
      ...user,
      password: hash,
    });

    return this.generateTokens(updatedUser);
  }
}
