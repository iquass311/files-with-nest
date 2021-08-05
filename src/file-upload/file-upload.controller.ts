import {
  Body,
  Controller,
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

  /*
  @Get()
  getAllFiles(): File[] {
    return this.fileUploadService.getAllFiles();
  }

  @Get('latest')
  getLatestFile(): File {
    return this.fileUploadService.getLatestFile();
  }

  @Get(':id')
  getFile(@Param('id') fileId: string): File {
    return this.fileUploadService.getSingleFile(fileId);
  }

  @Put(':id')
  replaceFile(@Param('id') fileId: string, @Body('title') fileTitle: string) {
    this.fileUploadService.replaceFile(fileId, fileTitle);
  }
 */
}
