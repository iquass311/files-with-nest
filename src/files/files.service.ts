import { Injectable } from '@nestjs/common';
import { BufferedFile, FileData, FileMetadata } from './file.model';
import { MinioClientService } from '../minio-client/minio-client.service';

@Injectable()
export class FilesService {
  constructor(private minioClientService: MinioClientService) {}

  async uploadFile(file: BufferedFile): Promise<{ metaData: FileMetadata; message: string }> {
    const uploadedFile: FileMetadata = await this.minioClientService.upload(file);

    return {
      metaData: uploadedFile,
      message: 'File upload successful',
    };
  }

  async updateFile(
    file: BufferedFile,
    objectName: string,
  ): Promise<{ metaData: FileMetadata; message: string }> {
    const updatedFile: FileMetadata = await this.minioClientService.upload(file, objectName);

    return {
      metaData: updatedFile,
      message: 'File update successful',
    };
  }

  async deleteFile(objectName: string) {
    await this.minioClientService.delete(objectName);
  }

  async getFile(objectName: string): Promise<FileData> {
    const statObject: FileData = await this.minioClientService.get(objectName);
    return statObject;
  }

  async getLatestFile() {
    const fileArray: FileData[] = await this.minioClientService.getAll();
    const latestFile = fileArray.reduce((accumulator, currentValue) => {
      return accumulator.lastModified > currentValue.lastModified ? accumulator : currentValue;
    });
    return latestFile;
  }

  async getAllFiles() {
    const fileDataArray: FileData[] = await this.minioClientService.getAll();
    return fileDataArray;
  }
}
