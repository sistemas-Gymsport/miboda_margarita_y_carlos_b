const { invalidateInvitationCache } = require('../services/cacheService');

/** Invalida la cache publica cuando una operacion administrativa modifica datos con exito. */
function invalidateOnMutation(req, res, next) {
  if (req.method === 'GET') return next();
  res.on('finish', () => {
    if (res.statusCode < 400) invalidateInvitationCache();
  });
  return next();
}

module.exports = { invalidateOnMutation };
