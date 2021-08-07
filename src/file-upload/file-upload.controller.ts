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
import { FileUploadService } from './files-upload.service';
import { File } from './file.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from 'src/minio-client/file.model';

@Controller('files')
export class FileUploadController {
  constructor(private fileUploadService: FileUploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: BufferedFile) {
    return await this.fileUploadService.uploadFile(file);
  }

  @Delete(':id')
  async deleteFile(@Param('id') fileId: string) {
    return await this.fileUploadService.deleteFile(fileId);
  }

  @Get('latest')
  async getLatestFile() {
    return await this.fileUploadService.getLatestFile();
  }

  @Get(':id')
  async getFile(@Param('id') fileId: string) {
    return await this.fileUploadService.getFile(fileId);
  }

  /*
  @Get()
  getAllFiles(): File[] {
    return this.fileUploadService.getAllFiles();
  }


  @Put(':id')
  replaceFile(@Param('id') fileId: string, @Body('title') fileTitle: string) {
    this.fileUploadService.replaceFile(fileId, fileTitle);
  }
 */
}
