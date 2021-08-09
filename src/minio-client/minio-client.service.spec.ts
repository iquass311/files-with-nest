import { Test, TestingModule } from '@nestjs/testing';
import { MinioService } from 'nestjs-minio-client';
import { mockMinioService } from '../../test/mocks';
import { MinioClientService } from '../minio-client/minio-client.service';

describe('MinioClientService', () => {
  let service: MinioClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MinioClientService, { provide: MinioService, useValue: mockMinioService }],
    }).compile();

    service = module.get<MinioClientService>(MinioClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
