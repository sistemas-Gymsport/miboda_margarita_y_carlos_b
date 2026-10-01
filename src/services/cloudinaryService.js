const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');
const env = require('../config/env');
const logger = require('../utils/logger');
const { HttpError } = require('../utils/httpError');

function ensureConfigured() {
  if (!isCloudinaryConfigured) throw new HttpError(503, 'El servicio de imagenes no esta configurado');
}

/**
 * Sube un buffer a Cloudinary conservando el archivo original (tamano y proporcion).
 * La optimizacion ocurre al entregarla (f_auto, q_auto y ancho segun pantalla).
 */
function uploadImage(buffer, { folder = 'gallery' } = {}) {
  ensureConfigured();
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `${env.CLOUDINARY_FOLDER}/${folder}`,
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        overwrite: false,
      },
      (error, result) => {
        if (error) {
          logger.error('Cloudinary', `Error al subir imagen: ${error.message}`);
          return reject(new HttpError(502, 'No se pudo subir la imagen. Intentalo nuevamente.'));
        }
        logger.info('Cloudinary', `Imagen subida: ${result.public_id}`);
        return resolve({
          publicId: result.public_id,
          secureUrl: result.secure_url,
          width: result.width,
          height: result.height,
        });
      }
    );
    stream.end(buffer);
  });
}

/** Elimina una imagen. Los errores se registran pero no interrumpen el flujo. */
async function deleteImage(publicId) {
  if (!publicId || !isCloudinaryConfigured) return false;
  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image', invalidate: true });
    logger.info('Cloudinary', `Eliminacion ${publicId}: ${result.result}`);
    return result.result === 'ok';
  } catch (error) {
    logger.error('Cloudinary', `No se pudo eliminar ${publicId}: ${error.message}`);
    return false;
  }
}

module.exports = { uploadImage, deleteImage };
