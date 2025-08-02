import { Test, TestingModule } from '@nestjs/testing';
import { EmailsController } from './emails.controller';
import { EmailsService } from './emails.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { createMockRepositoryProvider } from '../test/test-utils';
import { EmailEntity } from './entities/email.entity';
import { EmailClickEventEntity } from './entities/email-click-event.entity';
import { UserEntity } from '../users/entities/user.entity';

describe('EmailsController', () => {
  let controller: EmailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailsController],
      providers: [
        EmailsService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        createMockRepositoryProvider(EmailEntity),
        createMockRepositoryProvider(EmailClickEventEntity),
        createMockRepositoryProvider(UserEntity),
      ],
    }).compile();

    controller = module.get<EmailsController>(EmailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
