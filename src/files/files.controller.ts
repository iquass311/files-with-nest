import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { FilesService } from './files.service';
import { File } from './file.model';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  addFile(@Body('title') title: string): { id: string } {
    const generatedId = this.filesService.insertFile(title);
    return { id: generatedId };
  }

  @Get()
  getAllFiles(): File[] {
    return this.filesService.getAllFiles();
  }

  @Get('latest')
  getLatestFile(): File {
    return this.filesService.getLatestFile();
  }

  @Get(':id')
  getFile(@Param('id') fileId: string): File {
    return this.filesService.getSingleFile(fileId);
  }

  @Put(':id')
  replaceFile(@Param('id') fileId: string, @Body('title') fileTitle: string) {
    this.filesService.replaceFile(fileId, fileTitle);
  }
}
