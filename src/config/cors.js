const env = require('./env');

const corsOptions = {
  origin(origin, callback) {
    // Peticiones sin origin (curl, health checks de Render) se permiten.
    if (!origin) return callback(null, true);
    const normalized = origin.replace(/\/$/, '');
    if (env.FRONTEND_URLS.includes(normalized)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'If-None-Match'],
  exposedHeaders: ['ETag'],
  maxAge: 86400,
};

module.exports = corsOptions;
