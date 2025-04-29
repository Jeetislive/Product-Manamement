import s3 from '../config/s3.js';
import dotenv from 'dotenv';
dotenv.config();

export const uploadFile = async (file, key) => {
  await s3.putObject({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ACL: 'public-read',
    ContentType: file.mimetype,
  }).promise();

  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

export const moveFile = async (oldKey, newKey) => {
  await s3.copyObject({
    Bucket: process.env.AWS_BUCKET_NAME,
    CopySource: `${process.env.AWS_BUCKET_NAME}/${oldKey}`,
    Key: newKey,
    ACL: 'public-read',
  }).promise();
  await s3.deleteObject({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: oldKey,
  }).promise();
};

export const deleteFile = async (key) => {
  await s3.deleteObject({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  }).promise();
};
