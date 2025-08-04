import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailsService } from './emails.service';
import { EmailsController } from './emails.controller';
import { join } from 'path';
import { EnvKeys } from 'src/shared/constants/env.const';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { EmailEntity } from './entities/email.entity';
import { UsersService } from 'src/users/users.service';
import { EmailClickEventEntity } from './entities/email-click-event.entity';
import { EmailOpenEventEntity } from './entities/email-open-event.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      UserEntity,
      EmailEntity,
      EmailClickEventEntity,
      EmailOpenEventEntity,
    ]),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get(EnvKeys.SMTP_HOST),
          port: parseInt(config.get(EnvKeys.SMTP_PORT), 10),
          secure: false,
          auth: {
            user: config.get(EnvKeys.SMTP_USER),
            pass: config.get(EnvKeys.SMTP_PASS),
          },
        },
        defaults: {
          from: config.get(EnvKeys.SMTP_FROM_EMAIL),
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: { strict: true },
        },
      }),
    }),
  ],
  controllers: [EmailsController],
  providers: [EmailsService, UsersService],
  exports: [EmailsService],
})
export class EmailsModule {}
