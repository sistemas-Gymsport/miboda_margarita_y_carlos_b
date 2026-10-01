const env = require('../config/env');

const AUTH_COOKIE = 'wedding_admin_session';

function authCookieOptions() {
  const sameSite = ['none', 'lax', 'strict'].includes(env.COOKIE_SAMESITE) ? env.COOKIE_SAMESITE : 'lax';
  return {
    httpOnly: true,
    // sameSite "none" exige secure=true; en produccion siempre secure.
    secure: env.isProduction || sameSite === 'none',
    sameSite,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

module.exports = { AUTH_COOKIE, authCookieOptions };
