import { Injectable, NotFoundException } from '@nestjs/common';
import { BufferedFile } from 'src/minio-client/file.model';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { threadId } from 'worker_threads';
import { File } from './file.model';

@Injectable()
export class FileUploadService {
  constructor(private minioClientService: MinioClientService) {}

  private files: File[] = [];

  async uploadFile(file: BufferedFile) {
    // const fileId = Math.floor(Math.random() * 10000).toString();
    // const newFile = new File(fileId, title, new Date());
    // this.files.push(newFile);
    // return fileId;

    const uploadedFile = await this.minioClientService.upload(file);

    return {
      metaData: uploadedFile,
      message: 'File upload successful',
    };
  }

  async updateFile(file: BufferedFile, objectName: string) {
    // const fileId = Math.floor(Math.random() * 10000).toString();
    // const newFile = new File(fileId, title, new Date());
    // this.files.push(newFile);
    // return fileId;

    const updatedFile = await this.minioClientService.upload(file, objectName);

    return {
      metaData: updatedFile,
      message: 'File upload successful',
    };
  }

  async deleteFile(objectName: string) {
    await this.minioClientService.delete(objectName);
  }

  async getFile(objectName: string) {
    const statObject = await this.minioClientService.get(objectName);
    return statObject;
  }

  async getLatestFile() {
    const fileArray: any[] = await this.minioClientService.getAll();
    const latestFile = fileArray.reduce((accumulator, currentValue) => {
      return accumulator.lastModified > currentValue.lastModified ? accumulator : currentValue;
    });
    return latestFile;
  }

  async getAllFiles() {
    const fileArray: any[] = await this.minioClientService.getAll();
    return fileArray;
  }
}
