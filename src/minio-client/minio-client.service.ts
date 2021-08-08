import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { BufferedFile, FileData, FileMetadata } from '../files/file.model';
import * as crypto from 'crypto';

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

  public async upload(
    file: BufferedFile,
    objectName: string = '',
    bucketName: string = this.bucketName,
  ): Promise<FileMetadata> {
    // optionally restrict allowed file type
    // if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
    //   throw new HttpException('File type not supported.', HttpStatus.BAD_REQUEST);
    // }

    let existingFile;
    let existingFileMetaData;
    let fileName = '';

    if (objectName) {
      existingFile = await this.get(objectName);
      existingFileMetaData = existingFile.metaData;
      console.log('File found: ', existingFile);
    }

    if (objectName) {
      fileName = objectName;
    } else {
      const timestamp = Date.now().toString();
      const hashedFileName = crypto.createHash('md5').update(timestamp).digest('hex');
      const extension = file.originalname.substring(
        file.originalname.lastIndexOf('.'),
        file.originalname.length,
      );
      fileName = hashedFileName + extension;
    }

    const metaData: FileMetadata = {
      name: fileName,
      originalname: file.originalname,
      encoding: file.encoding,
      mimetype: file.mimetype,
      size: file.size,
      createddate: existingFileMetaData ? existingFileMetaData.createddate : new Date(),
      modifieddate: new Date(),
    };

    this.client.putObject(bucketName, fileName, file.buffer, metaData, function (err, res) {
      if (err) {
        throw new HttpException('Error uploading file.', HttpStatus.BAD_REQUEST);
      }
    });

    return metaData;
  }

  public async delete(objectName: string, bucketName: string = this.bucketName) {
    this.client.removeObject(bucketName, objectName, function (err, res) {
      if (err) {
        throw new HttpException('An error occured when deleting.', HttpStatus.BAD_REQUEST);
      }
    });
  }

  public async get(objectName: string, bucketName: string = this.bucketName): Promise<FileData> {
    return this.client.statObject(bucketName, objectName);
  }

  //TODO: this throws an error when there is exactly 1 file in the bucket
  public async getAll(bucketName: string = this.bucketName): Promise<FileData[]> {
    const fileDataArray: FileData[] = await new Promise((resolve, reject) => {
      const arr: FileData[] = [];
      const stream = this.client.listObjects(bucketName);
      stream.on('data', (obj) => {
        arr.push(obj);
      });
      stream.on('error', reject);
      stream.on('end', () => {
        resolve(arr);
      });
    });

    return fileDataArray;
  }
}
