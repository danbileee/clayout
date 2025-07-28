import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailEntity } from './entities/email.entity';
import {
  RecordEmailClickDto,
  RecordEmailOpenDto,
  SendEmailDto,
} from './dtos/email.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { EmailClickEventEntity } from './entities/email-click-event.entity';

@Injectable()
export class EmailsService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectRepository(EmailEntity)
    private readonly emailsRepository: Repository<EmailEntity>,
    @InjectRepository(EmailClickEventEntity)
    private readonly emailClickEventsRepository: Repository<EmailClickEventEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  createEmail(email: Partial<EmailEntity>): EmailEntity {
    return this.emailsRepository.create(email);
  }

  async sendEmail(email: EmailEntity): Promise<EmailEntity> {
    const sendEmailDto: SendEmailDto = {
      to: email.to,
      subject: email.subject,
      template: email.template,
      context: email.context,
    };

    try {
      await this.mailerService.sendMail(sendEmailDto);

      const updatedEmail: EmailEntity = {
        ...email,
        sent_at: new Date(),
      };

      await this.emailsRepository.save(updatedEmail);

      return updatedEmail;
    } catch (err) {
      const updatedEmail: EmailEntity = {
        ...email,
        failed_at: new Date(),
        error_log: String(err),
      };

      await this.emailsRepository.save(updatedEmail);

      return updatedEmail;
    }
  }

  async recordOpen({ id }: RecordEmailOpenDto): Promise<EmailEntity> {
    const matchedEmail = await this.emailsRepository.findOne({
      where: { id },
    });

    if (!matchedEmail) {
      throw new InternalServerErrorException(`Email not found.`);
    }

    return await this.emailsRepository.save({
      ...matchedEmail,
      opened_at: new Date(),
    });
  }

  async recordClick({
    email,
    ...recordEmailClickDto
  }: RecordEmailClickDto): Promise<EmailClickEventEntity> {
    const matchedEmail = await this.emailsRepository.findOne({
      where: { id: email.id },
    });

    if (!matchedEmail) {
      throw new InternalServerErrorException(`Email not found.`);
    }

    const createdEvent = this.emailClickEventsRepository.create({
      ...recordEmailClickDto,
      email: matchedEmail,
      clicked_at: new Date(),
    });

    await this.emailClickEventsRepository.save(createdEvent);

    return createdEvent;
  }
}
