import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvKeys } from 'src/shared/constants/env.const';
import { CountersModule } from './counters/counters.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>(EnvKeys.DATABASE_URL),
        ssl: { rejectUnauthorized: false },
        autoLoadEntities: true,
        synchronize: false,
        entities: [__dirname + '/**/*.entity.{js,ts}'],
      }),
      inject: [ConfigService],
    }),
    CountersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
