import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvKeys } from '../constants/env.const';

@Injectable()
export class UploaderService {
  private s3: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      region: 'auto',
      endpoint: this.configService.get(EnvKeys.CF_R2_URL),
      forcePathStyle: true,
      credentials: {
        accessKeyId: this.configService.get(EnvKeys.CF_R2_ACCESS_KEY_ID),
        secretAccessKey: this.configService.get(
          EnvKeys.CF_R2_SECRET_ACCESS_KEY,
        ),
      },
    });
  }

  async getSignedUrl(
    input: Pick<PutObjectCommandInput, 'Key' | 'ContentType'>,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.configService.get(EnvKeys.CF_R2_ASSETS_BUCKET),
      ...input,
    });

    return await getSignedUrl(this.s3, command, { expiresIn: 300 });
  }

  async upload(input: PutObjectCommandInput): Promise<PutObjectCommandOutput> {
    return await this.s3.send(new PutObjectCommand(input));
  }
}
