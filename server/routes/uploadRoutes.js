import { uploadTempImage } from '../controllers/uploadController.js';

export default [
  {
    method: 'POST',
    path: '/upload-temp',
    options: {
      payload: {
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data',
        multipart: true,
        maxBytes: 1024 * 1024 * 5, // Max 5MB
      },
      handler: uploadTempImage,
    },
  },
];
