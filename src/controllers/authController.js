const authService = require('../services/authService');
const { AUTH_COOKIE, authCookieOptions } = require('../utils/cookies');
const { validate, rules } = require('../utils/validators');

const loginSchema = {
  username: rules.string(60, { required: true }),
  password: (value) => String(value ?? '').slice(0, 200),
};

async function login(req, res) {
  const { username, password } = validate(req.body, loginSchema, { partial: false });
  const { token, user } = await authService.login(username, password);
  res.cookie(AUTH_COOKIE, token, authCookieOptions());
  res.json({ success: true, data: { user } });
}

function logout(req, res) {
  const { maxAge, ...options } = authCookieOptions();
  res.clearCookie(AUTH_COOKIE, options);
  res.json({ success: true });
}

function me(req, res) {
  res.json({ success: true, data: { user: req.user } });
}

async function changePassword(req, res) {
  const currentPassword = String(req.body?.currentPassword ?? '');
  const newPassword = String(req.body?.newPassword ?? '');
  await authService.changePassword(req.user.id, currentPassword, newPassword);
  res.json({ success: true });
}

module.exports = { login, logout, me, changePassword };
