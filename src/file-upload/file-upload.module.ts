import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './files-upload.service';
import { Module } from '@nestjs/common';
import { MinioClientModule } from 'src/minio-client/minio-client.module';

@Module({
  imports: [MinioClientModule],
  controllers: [FileUploadController],
  providers: [FileUploadService],
})
export class FileUploadModule {}
