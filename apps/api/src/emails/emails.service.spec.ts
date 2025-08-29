import { Test, TestingModule } from '@nestjs/testing';
import { EmailsService } from './emails.service';
import { MailerService } from '@nestjs-modules/mailer';
import { createMockRepositoryProvider } from '../../test/test-utils';
import { EmailEntity } from './entities/email.entity';
import { EmailClickEventEntity } from './entities/email-click-event.entity';
import { EmailOpenEventEntity } from './entities/email-open-event.entity';
import { UserEntity } from '../users/entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RecordEmailClickDto } from '@clayout/interface';

describe('EmailsService', () => {
  let service: EmailsService;
  let mailerService: jest.Mocked<MailerService>;
  let emailsRepository: jest.Mocked<Repository<EmailEntity>>;
  let emailClickEventsRepository: jest.Mocked<
    Repository<EmailClickEventEntity>
  >;
  let emailOpenEventsRepository: jest.Mocked<Repository<EmailOpenEventEntity>>;

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
        createMockRepositoryProvider(EmailOpenEventEntity),
        createMockRepositoryProvider(UserEntity),
      ],
    }).compile();

    service = module.get<EmailsService>(EmailsService);
    mailerService = module.get(MailerService);
    emailsRepository = module.get(getRepositoryToken(EmailEntity));
    emailClickEventsRepository = module.get(
      getRepositoryToken(EmailClickEventEntity),
    );
    emailOpenEventsRepository = module.get(
      getRepositoryToken(EmailOpenEventEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createEmail', () => {
    it('should create an email successfully', async () => {
      const emailData = {
        to: 'test@example.com',
        subject: 'Test Subject',
        template: 'test-template',
        context: { name: 'Test User' },
      };

      const mockEmail = { id: 1, ...emailData } as unknown as EmailEntity;
      emailsRepository.create.mockReturnValue(mockEmail);
      emailsRepository.save.mockResolvedValue(mockEmail);

      const result = await service.createEmail(emailData);

      expect(emailsRepository.create).toHaveBeenCalledWith(emailData);
      expect(emailsRepository.save).toHaveBeenCalledWith(mockEmail);
      expect(result).toEqual(mockEmail);
    });
  });

  describe('sendEmail', () => {
    const mockEmail: EmailEntity = {
      id: 1,
      to: 'test@example.com',
      subject: 'Test Subject',
      template: 'test-template',
      context: { name: 'Test User' },
    } as unknown as EmailEntity;

    it('should send email successfully on first attempt', async () => {
      mailerService.sendMail.mockResolvedValue(undefined);
      emailsRepository.save.mockResolvedValue(mockEmail);

      const result = await service.sendEmail(mockEmail);

      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to: mockEmail.to,
        subject: mockEmail.subject,
        template: mockEmail.template,
        context: mockEmail.context,
        headers: {
          'X-SMTPAPI': JSON.stringify({
            filters: {
              clicktrack: { settings: { enable: 0 } },
              opentrack: { settings: { enable: 0 } },
            },
          }),
          'X-SendGrid-Bypass-Link-Management': 'true',
        },
      });
      expect(emailsRepository.save).toHaveBeenCalledWith({
        ...mockEmail,
        sentAt: expect.any(Date),
      });
      expect(result.sentAt).toBeDefined();
    });

    it('should retry without headers if first attempt fails', async () => {
      mailerService.sendMail
        .mockRejectedValueOnce(new Error('First attempt failed'))
        .mockResolvedValueOnce(undefined);
      emailsRepository.save.mockResolvedValue(mockEmail);

      const result = await service.sendEmail(mockEmail);

      expect(mailerService.sendMail).toHaveBeenCalledTimes(2);
      expect(emailsRepository.save).toHaveBeenCalledWith({
        ...mockEmail,
        sentAt: expect.any(Date),
      });
      expect(result.sentAt).toBeDefined();
    });

    it('should mark email as failed if both attempts fail', async () => {
      const error = new Error('Send failed');
      mailerService.sendMail.mockRejectedValue(error);
      emailsRepository.save.mockResolvedValue(mockEmail);

      const result = await service.sendEmail(mockEmail);

      expect(mailerService.sendMail).toHaveBeenCalledTimes(2);
      expect(emailsRepository.save).toHaveBeenCalledWith({
        ...mockEmail,
        failedAt: expect.any(Date),
        errorLog: expect.stringContaining('Send failed'),
      });
      expect(result.failedAt).toBeDefined();
      expect(result.errorLog).toBeDefined();
    });
  });

  describe('recordOpen', () => {
    it('should record email open event successfully', async () => {
      const emailId = 1;
      const mockEmail = { id: emailId, to: 'test@example.com' } as EmailEntity;
      const mockOpenEvent = {
        id: emailId,
        email: mockEmail,
        openedAt: new Date(),
      } as EmailOpenEventEntity;

      emailsRepository.findOne.mockResolvedValue(mockEmail);
      emailOpenEventsRepository.create.mockReturnValue(mockOpenEvent);
      emailOpenEventsRepository.save.mockResolvedValue(mockOpenEvent);

      const result = await service.recordOpen(emailId);

      expect(emailsRepository.findOne).toHaveBeenCalledWith({
        where: { id: emailId },
      });
      expect(emailOpenEventsRepository.create).toHaveBeenCalledWith({
        id: emailId,
        email: mockEmail,
        openedAt: expect.any(Date),
      });
      expect(emailOpenEventsRepository.save).toHaveBeenCalledWith(
        mockOpenEvent,
      );
      expect(result).toEqual(mockOpenEvent);
    });

    it('should throw error when email not found', async () => {
      const emailId = 999;
      emailsRepository.findOne.mockResolvedValue(null);

      await expect(service.recordOpen(emailId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.recordOpen(emailId)).rejects.toThrow(
        'Email not found.',
      );
    });
  });

  describe('recordClick', () => {
    it('should record email click event successfully', async () => {
      const emailId = 1;
      const mockEmail = {
        id: emailId,
        to: 'test@example.com',
      } as unknown as EmailEntity;
      const clickData: RecordEmailClickDto = {
        link: 'https://example.com',
        buttonText: 'Click Here',
      };
      const mockClickEvent = {
        ...clickData,
        email: mockEmail,
        clickedAt: new Date(),
      } as EmailClickEventEntity;

      emailsRepository.findOne.mockResolvedValue(mockEmail);
      emailClickEventsRepository.create.mockReturnValue(mockClickEvent);
      emailClickEventsRepository.save.mockResolvedValue(mockClickEvent);

      const result = await service.recordClick(clickData, emailId);

      expect(emailsRepository.findOne).toHaveBeenCalledWith({
        where: { id: emailId },
      });
      expect(emailClickEventsRepository.create).toHaveBeenCalledWith({
        ...clickData,
        email: mockEmail,
        clickedAt: expect.any(Date),
      });
      expect(emailClickEventsRepository.save).toHaveBeenCalledWith(
        mockClickEvent,
      );
      expect(result).toEqual(mockClickEvent);
    });

    it('should throw error when email not found for click', async () => {
      const emailId = 999;
      const clickData: RecordEmailClickDto = {
        link: 'https://example.com',
        buttonText: 'Click Here',
      };
      emailsRepository.findOne.mockResolvedValue(null);

      await expect(service.recordClick(clickData, emailId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.recordClick(clickData, emailId)).rejects.toThrow(
        'Email not found.',
      );
    });
  });
});
