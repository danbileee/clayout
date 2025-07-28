import { PickType } from '@nestjs/mapped-types';
import { EmailEntity } from '../entities/email.entity';
import { EmailClickEventEntity } from '../entities/email-click-event.entity';

export class SendEmailDto extends PickType(EmailEntity, [
  'to',
  'subject',
  'template',
  'context',
]) {}

export class RecordEmailOpenDto extends PickType(EmailEntity, ['id']) {}

export class RecordEmailClickDto extends PickType(EmailClickEventEntity, [
  'link',
  'button_text',
]) {
  email: Pick<EmailEntity, 'id'>;
}
