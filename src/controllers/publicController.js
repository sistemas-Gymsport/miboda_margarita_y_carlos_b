const prisma = require('../config/prisma');
const { getCachedInvitation } = require('../services/cacheService');
const { buildInvitation } = require('../services/invitationService');

/** GET /api/public/invitation — toda la invitacion en una sola respuesta, con ETag. */
async function getInvitation(req, res) {
  const { body, etag } = await getCachedInvitation(() => buildInvitation());

  res.set({
    ETag: etag,
    // El navegador revalida siempre (304 barato); los cambios del admin se ven al instante.
    'Cache-Control': 'public, no-cache',
    Vary: 'Origin',
  });

  if (req.headers['if-none-match'] === etag) return res.status(304).end();
  return res.type('application/json').send(body);
}

function health(req, res) {
  res.set('Cache-Control', 'no-store');
  res.json({ ok: true });
}

/**
 * GET /api/warm — para el monitor externo que mantiene el servicio despierto.
 * A diferencia de /health, toca la base de datos (Neon tambien se suspende) y deja
 * la invitacion lista en cache para el siguiente invitado.
 */
async function warm(req, res) {
  const started = Date.now();
  await prisma.$queryRaw`SELECT 1`;
  await getCachedInvitation(() => buildInvitation());
  res.set('Cache-Control', 'no-store');
  res.json({ ok: true, ms: Date.now() - started });
}

module.exports = { getInvitation, health, warm };
