const multer = require('multer');
const env = require('../config/env');
const { badRequest } = require('../utils/httpError');

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXT = /\.(jpe?g|png|webp)$/i;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.MAX_UPLOAD_MB * 1024 * 1024, files: 20 },
  fileFilter(req, file, cb) {
    if (!ALLOWED_MIME.includes(file.mimetype) || !ALLOWED_EXT.test(file.originalname || '')) {
      return cb(badRequest('Formato no permitido. Usa imagenes JPG, PNG o WEBP.'));
    }
    return cb(null, true);
  },
});

/** Verifica la firma binaria real del archivo (no solo el MIME declarado). */
function hasValidImageSignature(buffer) {
  if (!buffer || buffer.length < 12) return false;
  const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const isPng = buffer.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const isWebp = buffer.slice(0, 4).toString('ascii') === 'RIFF' && buffer.slice(8, 12).toString('ascii') === 'WEBP';
  return isJpeg || isPng || isWebp;
}

function verifyImageSignatures(req, res, next) {
  const files = req.files || (req.file ? [req.file] : []);
  if (!files.length) return next(badRequest('Selecciona al menos una imagen'));
  const invalid = files.find((file) => !hasValidImageSignature(file.buffer));
  if (invalid) return next(badRequest(`El archivo "${invalid.originalname}" no es una imagen valida`));
  return next();
}

module.exports = { upload, verifyImageSignatures };
