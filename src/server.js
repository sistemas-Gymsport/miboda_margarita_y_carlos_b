const env = require('./config/env');
const app = require('./app');
const prisma = require('./config/prisma');
const logger = require('./utils/logger');

const server = app.listen(env.PORT, () => {
  logger.info('Server', `API escuchando en el puerto ${env.PORT} (${env.NODE_ENV})`);
  logger.info('Server', `Origenes permitidos: ${env.FRONTEND_URLS.join(', ')}`);

  // Calienta la conexion a la base de datos sin bloquear el arranque ni /api/health.
  prisma
    .$connect()
    .then(() => logger.info('Prisma', 'Conexion a PostgreSQL lista'))
    .catch((err) => logger.error('Prisma', `No se pudo conectar a PostgreSQL: ${err.message}`));
});

async function shutdown(signal) {
  logger.info('Server', `${signal} recibido, cerrando...`);
  server.close(async () => {
    await prisma.$disconnect().catch(() => {});
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (reason) => {
  logger.error('Process', `Promesa no manejada: ${reason instanceof Error ? reason.message : reason}`);
});
