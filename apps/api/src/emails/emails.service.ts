import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailEntity } from './entities/email.entity';
import { EmailClickEventEntity } from './entities/email-click-event.entity';
import { EmailOpenEventEntity } from './entities/email-open-event.entity';
import { RecordEmailClickDto, SendEmailDto } from '@clayout/interface';

@Injectable()
export class EmailsService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectRepository(EmailEntity)
    private readonly emailsRepository: Repository<EmailEntity>,
    @InjectRepository(EmailClickEventEntity)
    private readonly emailClickEventsRepository: Repository<EmailClickEventEntity>,
    @InjectRepository(EmailOpenEventEntity)
    private readonly emailOpenEventsRepository: Repository<EmailOpenEventEntity>,
  ) {}

  async createEmail(email: Partial<EmailEntity>): Promise<EmailEntity> {
    const createdEmail = this.emailsRepository.create(email);
    return await this.emailsRepository.save(createdEmail);
  }

  async sendEmail(email: EmailEntity): Promise<EmailEntity> {
    const sendEmailDto: SendEmailDto = {
      to: email.to,
      subject: email.subject,
      template: email.template,
      context: email.context,
    };

    try {
      // Use raw nodemailer options to bypass SendGrid tracking
      await this.mailerService.sendMail({
        ...sendEmailDto,
        headers: {
          'X-SMTPAPI': JSON.stringify({
            filters: {
              clicktrack: {
                settings: {
                  enable: 0,
                },
              },
              opentrack: {
                settings: {
                  enable: 0,
                },
              },
            },
          }),
          // Bypass link management
          'X-SendGrid-Bypass-Link-Management': 'true',
        },
      });

      const updatedEmail: EmailEntity = {
        ...email,
        sentAt: new Date(),
      };

      await this.emailsRepository.save(updatedEmail);

      return updatedEmail;
    } catch (err) {
      // If the first attempt fails, try without headers
      try {
        await this.mailerService.sendMail(sendEmailDto);
      } catch (retryErr) {
        const updatedEmail: EmailEntity = {
          ...email,
          failedAt: new Date(),
          errorLog: String(err) + ' | Retry: ' + String(retryErr),
        };

        await this.emailsRepository.save(updatedEmail);

        return updatedEmail;
      }

      // If retry succeeds, continue with success flow
      const updatedEmail: EmailEntity = {
        ...email,
        sentAt: new Date(),
      };

      await this.emailsRepository.save(updatedEmail);

      return updatedEmail;
    }
  }

  async recordOpen(id: number): Promise<EmailOpenEventEntity> {
    const matchedEmail = await this.emailsRepository.findOne({
      where: { id },
    });

    if (!matchedEmail) {
      throw new NotFoundException(`Email not found.`);
    }

    const createdEvent = this.emailOpenEventsRepository.create({
      id,
      email: matchedEmail,
      openedAt: new Date(),
    });

    await this.emailOpenEventsRepository.save(createdEvent);

    return createdEvent;
  }

  async recordClick(
    recordEmailClickDto: RecordEmailClickDto,
    emailId: number,
  ): Promise<EmailClickEventEntity> {
    const matchedEmail = await this.emailsRepository.findOne({
      where: { id: emailId },
    });

    if (!matchedEmail) {
      throw new NotFoundException(`Email not found.`);
    }

    const createdEvent = this.emailClickEventsRepository.create({
      ...recordEmailClickDto,
      email: matchedEmail,
      clickedAt: new Date(),
    });

    await this.emailClickEventsRepository.save(createdEvent);

    return createdEvent;
  }
}
