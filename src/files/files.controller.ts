import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { File } from './file.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from 'src/minio-client/file.model';

@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: BufferedFile) {
    return await this.filesService.uploadFile(file);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  async updateFile(@UploadedFile() file: BufferedFile, @Param('id') fileId: string) {
    return await this.filesService.updateFile(file, fileId);
  }

  @Delete(':id')
  async deleteFile(@Param('id') fileId: string) {
    return await this.filesService.deleteFile(fileId);
  }

  @Get('latest')
  async getLatestFile() {
    return await this.filesService.getLatestFile();
  }

  @Get(':id')
  async getFile(@Param('id') fileId: string) {
    return await this.filesService.getFile(fileId);
  }

  @Get()
  async getAllFiles() {
    return await this.filesService.getAllFiles();
  }
}
