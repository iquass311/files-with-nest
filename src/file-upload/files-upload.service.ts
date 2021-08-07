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

  async deleteFile(objectName: string) {
    await this.minioClientService.delete(objectName);
  }

  async getFile(objectName: string) {
    const statObject = await this.minioClientService.get(objectName);
    return statObject;
  }

  async getLatestFile() {
    const fileArray: any[] = await this.minioClientService.getLatest();
    const latestFile = fileArray.reduce((accumulator, currentValue) => {
      return accumulator.lastModified > currentValue.lastModified ? accumulator : currentValue;
    });
    return latestFile;
  }

  /*
  getAllFiles(): File[] {
    return [...this.files];
  }

  getSingleFile(fileId: string): File {
    const file = this.findFile(fileId)[1];
    return { ...file };
  }

  getLatestFile(): File {
    const latestFile = this.files.reduce((accumulator, currentValue) => {
      return accumulator.createdDate > currentValue.createdDate ? accumulator : currentValue;
    });
    return latestFile;
  }

  replaceFile(fileId: string, fileTitle: string) {
    const fileIndex = this.findFile(fileId)[0];
    const newFile = new File(fileId, fileTitle, new Date());
    this.files[fileIndex] = newFile;
  }

  private findFile(fileId): [number, File] {
    const fileIndex = this.files.findIndex((file) => file.id === fileId);
    const file = this.files[fileIndex];
    if (!file) {
      throw new NotFoundException('File not found.');
    }
    return [fileIndex, file];
  }
*/
}
