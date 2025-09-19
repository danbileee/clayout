import { PexelsSearchDto } from '@clayout/interface';
import {
  Controller,
  Get,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';

@Controller('pexels')
export class PexelsController {
  @Get('search')
  async search(@Query() pexelsSearchDto: PexelsSearchDto) {
    const apiKey = process.env.PEXELS_API_KEY;

    if (!apiKey) {
      return { error: 'Pexels API key is not configured.' } as const;
    }

    const {
      query = 'wallpaper',
      page = 1,
      per_page = 80,
      color,
    } = pexelsSearchDto;

    try {
      const url = new URL('https://api.pexels.com/v1/search');
      url.searchParams.set('query', query);
      url.searchParams.set('per_page', per_page.toString());
      url.searchParams.set('page', page.toString());

      if (color) {
        url.searchParams.set('color', color);
      }

      const res = await fetch(url.toString(), {
        headers: { Authorization: apiKey },
        method: 'GET',
      });

      return await res.json();
    } catch {
      throw new InternalServerErrorException(
        'Failed to get response from Pexels API',
      );
    }
  }
}
