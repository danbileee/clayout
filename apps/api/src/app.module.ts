import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvKeys } from 'src/shared/constants/env.const';
import { CountersModule } from './counters/counters.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RoleGuard } from './users/guards/role.guard';
import { AccessTokenGuard } from './auth/guards/token.guard';
import { EmailsModule } from './emails/emails.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const isProduction = process.env.NODE_ENV === 'production';

        return {
          type: 'postgres',
          url: config.get<string>(EnvKeys.DATABASE_URL),
          ...(isProduction ? { ssl: { rejectUnauthorized: false } } : {}),
          autoLoadEntities: true,
          synchronize: !isProduction,
          entities: [__dirname + '/**/*.entity.{js,ts}'],
        };
      },
      inject: [ConfigService],
    }),
    CountersModule,
    AuthModule,
    UsersModule,
    EmailsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
