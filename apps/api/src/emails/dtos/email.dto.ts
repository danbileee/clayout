import { PickType } from '@nestjs/mapped-types';
import { EmailEntity } from '../entities/email.entity';
import { EmailClickEventEntity } from '../entities/email-click-event.entity';
import { EmailOpenEventEntity } from '../entities/email-open-event.entity';

export class SendEmailDto extends PickType(EmailEntity, [
  'to',
  'subject',
  'template',
  'context',
]) {}

export class RecordEmailOpenDto extends PickType(EmailOpenEventEntity, [
  'email',
]) {}

export class RecordEmailClickDto extends PickType(EmailClickEventEntity, [
  'link',
  'buttonText',
]) {}
