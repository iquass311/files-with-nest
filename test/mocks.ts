export const mockMinioService = {
  client: {
    setBucketPolicy: jest.fn(),
  },
};

export const mockMinioClientService = {
  constructor: jest.fn(() => {
    return {};
  }),
};

export const mockFilesService = {};
