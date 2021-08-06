import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { BufferedFile } from './file.model';
import * as crypto from 'crypto';
import { threadId } from 'worker_threads';

@Injectable()
export class MinioClientService {
  constructor(private readonly minio: MinioService) {
    this.logger = new Logger('MinioService');

    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: {
            AWS: ['*'],
          },
          Action: ['s3:ListBucketMultipartUploads', 's3:GetBucketLocation', 's3:ListBucket'],
          Resource: ['arn:aws:s3:::' + process.env.MINIO_BUCKET_NAME], // Change this according to your bucket name
        },
        {
          Effect: 'Allow',
          Principal: {
            AWS: ['*'],
          },
          Action: [
            's3:PutObject',
            's3:AbortMultipartUpload',
            's3:DeleteObject',
            's3:GetObject',
            's3:ListMultipartUploadParts',
          ],
          Resource: ['arn:aws:s3:::' + process.env.MINIO_BUCKET_NAME + '/*'], // Change this according to your bucket name
        },
      ],
    };

    this.client.setBucketPolicy(
      process.env.MINIO_BUCKET_NAME,
      JSON.stringify(policy),
      function (err) {
        if (err) throw err;

        console.log('Bucket policy set');
      },
    );
  }

  private readonly logger: Logger;
  private readonly bucketName = process.env.MINIO_BUCKET_NAME;

  public get client() {
    return this.minio.client;
  }

  public async upload(file: BufferedFile, bucketName: string = this.bucketName) {
    if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
      throw new HttpException('File type not supported.', HttpStatus.BAD_REQUEST);
    }

    const timestamp = Date.now().toString();
    const hashedFileName = crypto.createHash('md5').update(timestamp).digest('hex');
    const extension = file.originalname.substring(
      file.originalname.lastIndexOf('.'),
      file.originalname.length,
    );
    const metaData = { 'Content-Type': file.mimetype };

    const fileName = hashedFileName + extension;

    this.client.putObject(bucketName, fileName, file.buffer, metaData, function (err, res) {
      if (err) {
        throw new HttpException('Error uploading file.', HttpStatus.BAD_REQUEST);
      }
    });

    return {
      url: `${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${process.env.MINIO_BUCKET_NAME}/${fileName}`,
    };
  }

  public async delete(objectName: string, bucketName: string = this.bucketName) {
    this.client.removeObject(bucketName, objectName, function (err, res) {
      if (err) {
        throw new HttpException('An error occured when deleting.', HttpStatus.BAD_REQUEST);
      }
    });
  }

  public async get(objectName: string, bucketName: string = this.bucketName) {
    return this.client.statObject(bucketName, objectName);
  }
}
