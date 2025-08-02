import { Test, TestingModule } from '@nestjs/testing';
import { EmailsService } from './emails.service';
import { MailerService } from '@nestjs-modules/mailer';
import { createMockRepositoryProvider } from '../test/test-utils';
import { EmailEntity } from './entities/email.entity';
import { EmailClickEventEntity } from './entities/email-click-event.entity';
import { UserEntity } from '../users/entities/user.entity';

describe('EmailsService', () => {
  let service: EmailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailsService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
        createMockRepositoryProvider(EmailEntity),
        createMockRepositoryProvider(EmailClickEventEntity),
        createMockRepositoryProvider(UserEntity),
      ],
    }).compile();

    service = module.get<EmailsService>(EmailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
