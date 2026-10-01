const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const env = require('../config/env');
const logger = require('../utils/logger');
const { unauthorized, badRequest } = require('../utils/httpError');

// Hash ficticio para igualar tiempos de respuesta cuando el usuario no existe.
const DUMMY_HASH = bcrypt.hashSync('usuario-inexistente', 12);

async function login(username, password) {
  const user = await prisma.adminUser.findUnique({ where: { username } });
  const valid = await bcrypt.compare(password, user ? user.passwordHash : DUMMY_HASH);
  if (!user || !valid) {
    logger.warn('Auth', `Intento de inicio de sesion fallido para "${username}"`);
    throw unauthorized('Usuario o contrasena incorrectos');
  }

  await prisma.adminUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  logger.info('Auth', `Sesion iniciada: ${user.username}`);

  const token = jwt.sign({ sub: user.id, role: user.role }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
  return { token, user: { id: user.id, username: user.username, role: user.role } };
}

async function changePassword(userId, currentPassword, newPassword) {
  if (newPassword.length < 8) throw badRequest('La nueva contrasena debe tener al menos 8 caracteres');
  const user = await prisma.adminUser.findUnique({ where: { id: userId } });
  if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash))) {
    throw badRequest('La contrasena actual no es correcta');
  }
  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.adminUser.update({ where: { id: userId }, data: { passwordHash } });
  logger.info('Auth', `Contrasena actualizada: ${user.username}`);
}

module.exports = { login, changePassword };
