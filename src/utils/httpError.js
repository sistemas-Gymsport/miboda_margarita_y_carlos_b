class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.expose = true;
    if (details) this.details = details;
  }
}

const badRequest = (message, details) => new HttpError(400, message, details);
const unauthorized = (message = 'No autorizado') => new HttpError(401, message);
const notFound = (message = 'Recurso no encontrado') => new HttpError(404, message);

module.exports = { HttpError, badRequest, unauthorized, notFound };
