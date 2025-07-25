import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class AuthorService {
  abstract isAuthor(userId: number, resourceId: number): Promise<boolean>;
}
