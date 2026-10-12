const crypto = require('crypto');
const logger = require('../utils/logger');

/**
 * Cache en memoria de la invitacion publica (cambia pocas veces).
 * Estrategia stale-while-revalidate: cuando la copia vence se sigue entregando al instante
 * y se reconstruye en segundo plano, asi ningun visitante espera a la base de datos.
 * Los cambios del panel invalidan la copia y la siguiente visita obtiene la version nueva.
 */
const TTL_MS = 5 * 60 * 1000;
let entry = null;
let pending = null;
let version = 0;

function createEtag(body) {
  return `W/"${crypto.createHash('sha1').update(body).digest('base64url')}"`;
}

function rebuild(builder) {
  // Evita construir la misma respuesta varias veces en paralelo (cold start).
  if (!pending) {
    const buildVersion = version;
    pending = (async () => {
      const payload = await builder();
      const body = JSON.stringify({ success: true, data: payload });
      const built = { body, etag: createEtag(body), createdAt: Date.now() };
      // Si hubo una invalidacion durante la construccion, no se guarda.
      if (buildVersion === version) entry = built;
      return built;
    })().finally(() => {
      pending = null;
    });
  }
  return pending;
}

async function getCachedInvitation(builder) {
  if (!entry) return rebuild(builder);
  if (Date.now() - entry.createdAt >= TTL_MS) {
    rebuild(builder).catch((err) => logger.error('Cache', `No se pudo actualizar la invitacion: ${err.message}`));
  }
  return entry;
}

function invalidateInvitationCache() {
  version += 1;
  if (entry) logger.info('Cache', 'Invitacion publica invalidada');
  entry = null;
}

module.exports = { getCachedInvitation, invalidateInvitationCache };
