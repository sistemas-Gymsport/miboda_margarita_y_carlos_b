const jwt = require('jsonwebtoken');
const env = require('../config/env');
const prisma = require('../config/prisma');
const { AUTH_COOKIE } = require('../utils/cookies');
const { unauthorized } = require('../utils/httpError');

async function requireAuth(req, res, next) {
  const token = req.cookies?.[AUTH_COOKIE];
  if (!token) return next(unauthorized('Tu sesion ha expirado. Inicia sesion nuevamente.'));

  let payload;
  try {
    payload = jwt.verify(token, env.JWT_SECRET);
  } catch {
    return next(unauthorized('Tu sesion ha expirado. Inicia sesion nuevamente.'));
  }

  const user = await prisma.adminUser.findUnique({
    where: { id: payload.sub },
    select: { id: true, username: true, role: true },
  });
  if (!user || user.role !== 'ADMIN') return next(unauthorized());

  req.user = user;
  return next();
}

module.exports = { requireAuth };
