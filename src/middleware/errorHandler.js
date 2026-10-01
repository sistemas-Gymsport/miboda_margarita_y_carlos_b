const multer = require('multer');
const env = require('../config/env');
const logger = require('../utils/logger');

function notFoundHandler(req, res) {
  res.status(404).json({ success: false, message: 'Ruta no encontrada' });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let status = err.status || err.statusCode || 500;
  let message = err.message;

  if (err instanceof multer.MulterError) {
    status = 400;
    message =
      err.code === 'LIMIT_FILE_SIZE'
        ? `La imagen supera el tamano maximo de ${env.MAX_UPLOAD_MB} MB`
        : err.code === 'LIMIT_FILE_COUNT'
          ? 'Demasiados archivos en una sola subida'
          : 'No se pudo procesar el archivo';
  } else if (err.type === 'entity.too.large') {
    status = 413;
    message = 'La solicitud es demasiado grande';
  } else if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'JSON invalido';
  } else if (err.code === 'P2025') {
    status = 404;
    message = 'Registro no encontrado';
  }

  if (status >= 500) {
    logger.error('HTTP', `${req.method} ${req.originalUrl} -> ${err.message}`, err);
  } else if (status !== 401) {
    logger.warn('HTTP', `${req.method} ${req.originalUrl} -> ${status} ${message}`);
  }

  const exposeMessage = status < 500 || !env.isProduction;
  res.status(status).json({
    success: false,
    message: exposeMessage ? message : 'Ocurrio un error',
    ...(status < 500 && err.details ? { errors: err.details } : {}),
  });
}

module.exports = { errorHandler, notFoundHandler };
