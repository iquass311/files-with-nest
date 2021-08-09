export interface BufferedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer | string;
}

export interface FileMetadata {
  name: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  createddate: Date;
  modifieddate: Date;
  'content-type'?: string;
}
export interface FileData {
  name?: string;
  size: number;
  metaData?: FileMetadata;
  lastModified: Date;
  etag: string;
}
