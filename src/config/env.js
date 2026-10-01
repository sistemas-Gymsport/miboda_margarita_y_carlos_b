const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env'), quiet: true });

const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta la variable de entorno obligatoria: ${name}`);
  }
  return value;
}

const env = {
  NODE_ENV,
  isProduction,
  PORT: Number(process.env.PORT) || 3000,
  FRONTEND_URLS: (process.env.FRONTEND_URL || 'http://localhost:5173')
    .split(',')
    .map((url) => url.trim().replace(/\/$/, ''))
    .filter(Boolean),
  JWT_SECRET: required('JWT_SECRET'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  COOKIE_SAMESITE: (process.env.COOKIE_SAMESITE || (isProduction ? 'none' : 'lax')).toLowerCase(),
  CLOUDINARY_CLOUD_NAME: (process.env.CLOUDINARY_CLOUD_NAME || '').trim(),
  CLOUDINARY_API_KEY: (process.env.CLOUDINARY_API_KEY || '').trim(),
  CLOUDINARY_API_SECRET: (process.env.CLOUDINARY_API_SECRET || '').trim(),
  CLOUDINARY_FOLDER: (process.env.CLOUDINARY_FOLDER || 'boda-invitacion').trim(),
  MAX_UPLOAD_MB: Number(process.env.MAX_UPLOAD_MB) || 8,
};

if (env.isProduction && env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET debe tener al menos 32 caracteres en produccion');
}

module.exports = env;
