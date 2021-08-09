import { Test, TestingModule } from '@nestjs/testing';
import { mockMinioClientService } from '../../test/mocks';
import { MinioClientService } from '../minio-client/minio-client.service';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

describe('FilesService', () => {
  let service: FilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [FilesService, { provide: MinioClientService, useValue: mockMinioClientService }],
    }).compile();

    service = module.get<FilesService>(FilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
