import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { EnvKeys } from './shared/constants/env.const';

const allowedOrigins = [
  process.env[EnvKeys.CORS_ENABLE_ORIGIN_LOCAL],
  process.env[EnvKeys.CORS_ENABLE_ORIGIN_ROOT],
  process.env[EnvKeys.CORS_ENABLE_ORIGIN_APP],
];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn('Blocked by CORS:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
