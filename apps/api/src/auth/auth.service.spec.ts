import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { EmailsService } from '../emails/emails.service';
import { createMockService } from '../../test/jest-setup';
import { UnauthorizedException } from '@nestjs/common';
import { UserRoles } from '../users/constants/role.const';
import { TokenTypes } from './constants/token.const';
import { UserEntity } from '../users/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;
  let usersService: jest.Mocked<UsersService>;
  let emailsService: jest.Mocked<EmailsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
            decode: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: createMockService<UsersService>({
            createUser: jest.fn(),
            getUser: jest.fn(),
            updateUser: jest.fn(),
          }),
        },
        {
          provide: EmailsService,
          useValue: createMockService<EmailsService>({
            createEmail: jest.fn(),
            sendEmail: jest.fn(),
            recordOpen: jest.fn(),
            recordClick: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
    usersService = module.get(UsersService);
    emailsService = module.get(EmailsService);

    // Setup default config values
    configService.get.mockReturnValue('test-secret');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateToken', () => {
    it('should generate token with default options', () => {
      const user = { id: 1, email: 'test@example.com' };
      const mockToken = 'mock.jwt.token';
      jwtService.sign.mockReturnValue(mockToken);

      const result = service.generateToken(user);

      expect(jwtService.sign).toHaveBeenCalledWith(
        {
          email: user.email,
          sub: user.id,
          type: undefined,
        },
        {
          secret: 'test-secret',
        },
      );
      expect(result).toBe(mockToken);
    });

    it('should generate token with custom options', () => {
      const user = { id: 1, email: 'test@example.com' };
      const mockToken = 'mock.jwt.token';
      jwtService.sign.mockReturnValue(mockToken);

      const result = service.generateToken(user, {
        tokenType: TokenTypes.access,
        expiresIn: '10m',
      });

      expect(jwtService.sign).toHaveBeenCalledWith(
        {
          email: user.email,
          sub: user.id,
          type: TokenTypes.access,
        },
        {
          secret: 'test-secret',
          expiresIn: '10m',
        },
      );
      expect(result).toBe(mockToken);
    });
  });

  describe('generateAccessToken', () => {
    it('should generate access token with correct options', () => {
      const user = { id: 1, email: 'test@example.com' };
      const mockToken = 'mock.access.token';
      jwtService.sign.mockReturnValue(mockToken);

      const result = service.generateAccessToken(user);

      expect(jwtService.sign).toHaveBeenCalledWith(
        {
          email: user.email,
          sub: user.id,
          type: TokenTypes.access,
        },
        {
          secret: 'test-secret',
          expiresIn: '10m',
        },
      );
      expect(result).toBe(mockToken);
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate refresh token with correct options', () => {
      const user = { id: 1, email: 'test@example.com' };
      const mockToken = 'mock.refresh.token';
      jwtService.sign.mockReturnValue(mockToken);

      const result = service.generateRefreshToken(user);

      expect(jwtService.sign).toHaveBeenCalledWith(
        {
          email: user.email,
          sub: user.id,
          type: TokenTypes.refresh,
        },
        {
          secret: 'test-secret',
          expiresIn: '14d',
        },
      );
      expect(result).toBe(mockToken);
    });
  });

  describe('generateTokens', () => {
    it('should generate both access and refresh tokens', () => {
      const user = { id: 1, email: 'test@example.com' };
      const mockAccessToken = 'mock.access.token';
      const mockRefreshToken = 'mock.refresh.token';

      jwtService.sign
        .mockReturnValueOnce(mockAccessToken)
        .mockReturnValueOnce(mockRefreshToken);

      const result = service.generateTokens(user);

      expect(result).toEqual({
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
      });
      expect(jwtService.sign).toHaveBeenCalledTimes(2);
    });
  });

  describe('verifyToken', () => {
    it('should verify valid token successfully', () => {
      const token = 'valid.token';
      const mockPayload = { sub: 1, email: 'test@example.com' };
      jwtService.verify.mockReturnValue(mockPayload);

      const result = service.verifyToken(token);

      expect(jwtService.verify).toHaveBeenCalledWith(token, {
        secret: 'test-secret',
      });
      expect(result).toEqual(mockPayload);
    });

    it('should throw UnauthorizedException for invalid token', () => {
      const token = 'invalid.token';
      jwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => service.verifyToken(token)).toThrow(UnauthorizedException);
      expect(() => service.verifyToken(token)).toThrow(
        'Token is invalid or expired',
      );
    });
  });

  describe('isTokenExpired', () => {
    it('should return true for expired token', () => {
      const token = 'expired.token';
      const expiredPayload = { exp: Math.floor(Date.now() / 1000) - 3600 }; // 1 hour ago
      jwtService.decode.mockReturnValue(expiredPayload);

      const result = service.isTokenExpired(token);

      expect(jwtService.decode).toHaveBeenCalledWith(token);
      expect(result).toBe(true);
    });

    it('should return false for valid token', () => {
      const token = 'valid.token';
      const validPayload = { exp: Math.floor(Date.now() / 1000) + 3600 }; // 1 hour from now
      jwtService.decode.mockReturnValue(validPayload);

      const result = service.isTokenExpired(token);

      expect(jwtService.decode).toHaveBeenCalledWith(token);
      expect(result).toBe(false);
    });

    it('should return true for token without exp', () => {
      const token = 'token.without.exp';
      jwtService.decode.mockReturnValue({ sub: 1 });

      const result = service.isTokenExpired(token);

      expect(result).toBe(true);
    });

    it('should return true for invalid token', () => {
      const token = 'invalid.token';
      jwtService.decode.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const result = service.isTokenExpired(token);

      expect(result).toBe(true);
    });
  });

  describe('authenticate', () => {
    it('should authenticate user with valid credentials', async () => {
      const userCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        role: UserRoles.User,
        username: 'testuser',
        emails: [],
        created_at: new Date(),
        updated_at: new Date(),
      } as unknown as UserEntity;
      usersService.getUser.mockResolvedValue(mockUser);

      // Mock bcrypt compare
      const bcrypt = require('bcrypt');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await service.authenticate(userCredentials);

      expect(usersService.getUser).toHaveBeenCalledWith({
        email: userCredentials.email,
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const userCredentials = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        role: UserRoles.User,
        username: 'testuser',
        emails: [],
        created_at: new Date(),
        updated_at: new Date(),
      } as unknown as UserEntity;
      usersService.getUser.mockResolvedValue(mockUser);

      // Mock bcrypt compare
      const bcrypt = require('bcrypt');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(service.authenticate(userCredentials)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.authenticate(userCredentials)).rejects.toThrow(
        'Wrong password.',
      );
    });

    it('should throw UnauthorizedException for non-existent user', async () => {
      const userCredentials = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };
      usersService.getUser.mockResolvedValue(null);

      await expect(service.authenticate(userCredentials)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.authenticate(userCredentials)).rejects.toThrow(
        "The user doesn't exist.",
      );
    });
  });

  describe('login', () => {
    it('should login user and return tokens', async () => {
      const userCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        role: UserRoles.User,
        username: 'testuser',
        emails: [],
        created_at: new Date(),
        updated_at: new Date(),
      } as unknown as UserEntity;
      const mockTokens = {
        accessToken: 'mock.access.token',
        refreshToken: 'mock.refresh.token',
      };

      usersService.getUser.mockResolvedValue(mockUser);
      const bcrypt = require('bcrypt');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      jwtService.sign
        .mockReturnValueOnce(mockTokens.accessToken)
        .mockReturnValueOnce(mockTokens.refreshToken);

      const result = await service.login(userCredentials);

      expect(result).toEqual(mockTokens);
    });
  });
});
