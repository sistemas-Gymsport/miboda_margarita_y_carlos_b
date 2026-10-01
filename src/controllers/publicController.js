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

module.exports = { getInvitation, health };
