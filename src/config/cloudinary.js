const cloudinary = require('cloudinary').v2;
const env = require('./env');
const logger = require('../utils/logger');

const isCloudinaryConfigured = Boolean(
  env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
} else {
  logger.warn('Cloudinary', 'Credenciales incompletas: la subida de imagenes estara deshabilitada');
}

module.exports = { cloudinary, isCloudinaryConfigured };
