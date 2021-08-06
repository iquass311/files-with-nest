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
  createdDate: Date;
  modifiedDate: Date;
}
