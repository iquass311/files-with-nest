import { FileData, FileMetadata } from '../src/files/file.model';

export const mockFileMetadata: FileMetadata = {
  name: '1293e67441f89ebd54bcd17f027706fa.png',
  originalname: 'shop.nono.moe_cart.png',
  encoding: '7bit',
  mimetype: 'image/png',
  size: 1117246,
  createddate: new Date(),
  modifieddate: new Date(),
  'content-type': 'binary/octet-stream',
};

export const mockFileData: FileData = {
  size: 1117246,
  metaData: mockFileMetadata,
  lastModified: new Date(),
  etag: '0fcd22d91d2471f49e74f6af23005669',
};

export const mockMinioService = {
  client: {
    setBucketPolicy: jest.fn(),
    listObjects: jest.fn(),
  },
};

export const mockMinioClientService = {
  constructor: jest.fn(() => {
    return {};
  }),
};

export const mockFilesService = {};
