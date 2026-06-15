import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const uploadToS3 = async (file, companyId) => {
  const fileStream = fs.createReadStream(file.path);
  const key = `${companyId}/${Date.now()}-${file.originalname}`;

  await s3Client.send(new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: fileStream,
    ContentType: file.mimetype,
  }));

  return {
    url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
    key,
  };
};

export const deleteFromS3 = async (key) => {
  await s3Client.send(new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  }));
};


// Create PreSigned Urls

import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const generateSignedUrl = async (key) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(s3, command, {
    expiresIn: 3600,
  });
};