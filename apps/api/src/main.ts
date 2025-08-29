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
].filter(Boolean); // Remove undefined/null values

console.log('CORS allowed origins:', allowedOrigins);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * CORS
   */
  app.enableCors({
    origin: (origin, callback) => {
      console.log('CORS request from origin:', origin);
      console.log('Allowed origins:', allowedOrigins);

      if (!origin || allowedOrigins.includes(origin)) {
        console.log('CORS: Allowing origin:', origin);
        callback(null, true);
      } else {
        console.warn('CORS: Blocked origin:', origin);
        console.warn('Expected one of:', allowedOrigins);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
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
