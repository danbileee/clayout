import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  GetObjectCommand,
  GetObjectCommandInput,
  CopyObjectCommand,
  CopyObjectCommandInput,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvKeys } from '../constants/env.const';

@Injectable()
export class UploaderService {
  private s3: S3Client;

  constructor(private readonly configService: ConfigService) {
    const accessKeyId = this.configService.get(EnvKeys.CF_R2_ACCESS_KEY_ID);
    const secretAccessKey = this.configService.get(
      EnvKeys.CF_R2_SECRET_ACCESS_KEY,
    );
    const endpoint = this.configService.get(EnvKeys.CF_R2_URL);

    // Validate required credentials
    if (!accessKeyId) {
      throw new Error(
        'CF_R2_ACCESS_KEY_ID environment variable is required but not set',
      );
    }
    if (!secretAccessKey) {
      throw new Error(
        'CF_R2_SECRET_ACCESS_KEY environment variable is required but not set',
      );
    }
    if (!endpoint) {
      throw new Error('CF_R2_URL environment variable is required but not set');
    }

    this.s3 = new S3Client({
      region: 'auto',
      endpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId,
        secretAccessKey,
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
    try {
      return await this.s3.send(new PutObjectCommand(input));
    } catch (error) {
      console.error('S3 Upload Error:', {
        message: error.message,
        bucket: input.Bucket,
        key: input.Key,
        contentType: input.ContentType,
      });
      throw error;
    }
  }

  async get(input: GetObjectCommandInput) {
    try {
      return await this.s3.send(new GetObjectCommand(input));
    } catch (error) {
      console.error('S3 Get Object Error:', {
        message: error.message,
        bucket: input.Bucket,
        key: input.Key,
      });
      throw error;
    }
  }

  async copy(input: CopyObjectCommandInput) {
    try {
      return await this.s3.send(new CopyObjectCommand(input));
    } catch (error) {
      console.error('S3 Copy Object Error:', {
        message: error.message,
        bucket: input.Bucket,
        key: input.Key,
        copySource: input.CopySource,
      });
      throw error;
    }
  }
}
