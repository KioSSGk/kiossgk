import { S3Client, DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const uploadFileToS3 = async (file: any): Promise<string> => {
  const fileContent = fs.readFileSync(file.filepath);
  const fileExtension = path.extname(file.originalFilename || '');
  const fileName = `${uuidv4()}${fileExtension}`;

  const uploadParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: fileName,
    Body: fileContent,
    ContentType: file.mimetype || 'application/octet-stream',
  };

  const parallelUploads3 = new Upload({
    client: s3Client,
    params: uploadParams,
  });

  const data = await parallelUploads3.done();
  return data.Location as string; // S3에 업로드된 파일의 URL
};

export const deleteFileFromS3 = async (key: string) => {
  const deleteParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: key,
  };

  await s3Client.send(new DeleteObjectCommand(deleteParams));
};

export const extractFileKeyFromUrl = (url: string): string => {
  const urlObj = new URL(url);
  return urlObj.pathname.substring(1); // 앞의 슬래시 제거
};

export default s3Client;
