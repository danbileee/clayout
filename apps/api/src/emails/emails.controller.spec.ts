import { Test, TestingModule } from '@nestjs/testing';
import { EmailsController } from './emails.controller';
import { EmailsService } from './emails.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { createMockRepositoryProvider } from '../../test/test-utils';
import { EmailEntity } from './entities/email.entity';
import { EmailClickEventEntity } from './entities/email-click-event.entity';
import { EmailOpenEventEntity } from './entities/email-open-event.entity';
import { UserEntity } from '../users/entities/user.entity';
import { RecordEmailClickDto } from '@clayout/interface';

describe('EmailsController', () => {
  let controller: EmailsController;
  let emailsService: jest.Mocked<EmailsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailsController],
      providers: [
        {
          provide: EmailsService,
          useValue: {
            createEmail: jest.fn(),
            sendEmail: jest.fn(),
            recordOpen: jest.fn(),
            recordClick: jest.fn(),
          },
        },
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
        createMockRepositoryProvider(EmailOpenEventEntity),
        createMockRepositoryProvider(UserEntity),
      ],
    }).compile();

    controller = module.get<EmailsController>(EmailsController);
    emailsService = module.get(EmailsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('trackOpen', () => {
    it('should track email open event and return gif', async () => {
      const emailId = 1;
      const mockResponse = {
        setHeader: jest.fn(),
        send: jest.fn(),
      } as any;

      emailsService.recordOpen.mockResolvedValue({} as EmailOpenEventEntity);

      await controller.trackOpen(emailId, mockResponse);

      expect(emailsService.recordOpen).toHaveBeenCalledWith(emailId);
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'image/gif',
      );
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Cache-Control',
        'no-cache, no-store, must-revalidate',
      );
      expect(mockResponse.send).toHaveBeenCalled();
    });
  });

  describe('trackClick', () => {
    it('should track email click event successfully', async () => {
      const emailId = 1;
      const clickData: RecordEmailClickDto = {
        link: 'https://example.com',
        buttonText: 'Click Here',
      };

      emailsService.recordClick.mockResolvedValue({} as EmailClickEventEntity);

      const result = await controller.trackClick(emailId, clickData);

      expect(emailsService.recordClick).toHaveBeenCalledWith(
        clickData,
        emailId,
      );
      expect(result).toBe(true);
    });
  });
});
