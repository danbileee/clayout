import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { EmailsService } from '../emails/emails.service';
import { createMockService } from '../test/jest-setup';

describe('AuthService', () => {
  let service: AuthService;

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
