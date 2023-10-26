import { S3 } from 'aws-sdk';
import { Injectable } from '@nestjs/common';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload';
import { v4 as uuid } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  constructor(private readonly configService: ConfigService) {}
  public async addFile(
    file: GraphQLUpload,
    s3Params?: S3.Types.PutObjectRequest,
  ): Promise<string> {
    if (!file) return null;

    const awsS3 = new S3({
      accessKeyId: this.configService.get('AWS_USER_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_USER_SECRET_ACCESS_KEY_ID'),
      region: this.configService.get('AWS_REGION'),
      params: this.configService.get('S3_BUCKET_NAME'),
    });

    const { filename, mimetype } = file;
    const fileKey = uuid() + filename;

    const params = {
      ...{
        ACL: 'public-read',
        ContentDisposition: 'inline',
        Bucket: this.configService.get('S3_BUCKET_NAME'),
        Key: fileKey,
        Body: file.createReadStream(),
        ContentType: mimetype,
      },
      ...s3Params,
    };

    await awsS3.upload(params).promise();

    return `https://${params.Bucket}.s3.${this.configService.get(
      'AWS_REGION',
    )}.amazonaws.com/${fileKey}`;
  }
}
