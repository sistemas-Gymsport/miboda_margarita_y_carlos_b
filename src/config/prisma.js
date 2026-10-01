require('./env');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const logger = require('../utils/logger');

/**
 * Prisma con el driver nativo de Node (pg). Node resuelve IPv4/IPv6 automaticamente
 * (happy eyeballs), lo que evita fallos de conexion en redes con IPv6 incompleto.
 */
function createPrismaClient() {
  const rawUrl = process.env.DATABASE_URL;
  if (!rawUrl) throw new Error('Falta la variable de entorno obligatoria: DATABASE_URL');
  // pg trata "require" como "verify-full"; lo hacemos explicito para evitar la advertencia.
  const connectionString = rawUrl.replace(/sslmode=require\b/, 'sslmode=verify-full');

  const adapter = new PrismaPg({
    connectionString,
    max: Number(process.env.DB_POOL_MAX) || 5,
    connectionTimeoutMillis: 20000,
    idleTimeoutMillis: 30000,
  });

  return new PrismaClient({
    adapter,
    log: [
      { emit: 'event', level: 'error' },
      { emit: 'event', level: 'warn' },
    ],
  });
}

const prisma = createPrismaClient();

prisma.$on('error', (e) => logger.error('Prisma', e.message));
prisma.$on('warn', (e) => logger.warn('Prisma', e.message));

module.exports = prisma;
module.exports.createPrismaClient = createPrismaClient;
