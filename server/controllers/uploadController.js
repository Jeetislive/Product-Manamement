import s3 from '../config/s3.js';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

export const uploadTempImage = async (request, res) => {
  const image = request.payload.file;
// console.log(image);

  if (!image || !image.hapi) {
    return res.response({ error: 'No image file uploaded' }).code(400);
  }

  const filename = `${randomUUID()}_${image.hapi.filename}`;
  const s3Key = `temp/${filename}`; // Save inside temp/ folder
//   console.log(filename);
  

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: s3Key,
    Body: image._data,
    ContentType: image.hapi.headers['content-type'],
    ACL: 'public-read',
  };

  try {
    await s3.putObject(params).promise();

    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

    return res.response({ imageUrl }).code(200);
  } catch (error) {
    console.error('S3 Upload Error:', error);
    return res.response({ error: 'Image upload failed' }).code(500);
  }
};
