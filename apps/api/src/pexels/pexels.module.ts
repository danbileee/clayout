import { Module } from '@nestjs/common';
import { PexelsController } from 'src/pexels/pexels.controller';

@Module({
  controllers: [PexelsController],
})
export class PexelsModule {}
