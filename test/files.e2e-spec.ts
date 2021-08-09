import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MinioService } from 'nestjs-minio-client';
import { MinioClientService } from '../src/minio-client/minio-client.service';
import { mockMinioService } from './mocks';

describe('FilesController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [MinioClientService, { provide: MinioService, useValue: mockMinioService }],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // it('/files (GET)', () => {
  //   return request(app.getHttpServer()).get('/files').expect(200).expect('Content-Type', /json/);
  // });

  it('/files (GET)', () => {
    return request(app.getHttpServer()).get('/files').expect(200).expect('Content-Type', /json/);
  });
});
