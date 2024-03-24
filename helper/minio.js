const minio = require('minio');
const minioClient = new minio.Client({
  endPoint: process.env.MINIO_POINT,
  port: parseInt(process.env.MINIO_PORT),
  useSSL: true,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY
});

module.exports = minioClient;