import { Injectable, NotFoundException } from '@nestjs/common';
import { File } from './file.model';

@Injectable()
export class FilesService {
  private files: File[] = [];

  insertFile(title: string): string {
    const fileId = Math.floor(Math.random() * 10000).toString();
    const newFile = new File(fileId, title, new Date());
    this.files.push(newFile);
    return fileId;
  }

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
}
