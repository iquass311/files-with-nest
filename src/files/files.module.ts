import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { Module } from '@nestjs/common';
import { MinioClientModule } from 'src/minio-client/minio-client.module';

@Module({
  imports: [MinioClientModule],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
