import './instrument';
import 'dotenv/config';
import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { EnvKeys } from './shared/constants/env.const';

const allowedOrigins = [
  process.env[EnvKeys.CORS_ENABLE_ORIGIN_LOCAL],
  process.env[EnvKeys.CORS_ENABLE_ORIGIN_ROOT],
  process.env[EnvKeys.CORS_ENABLE_ORIGIN_APP],
].filter(Boolean);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * CORS
   */
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  /**
   * Cookies
   */
  app.use(cookieParser());

  /**
   * API Versioning
   */
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  /**
   * Pipes
   */
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
